#!/usr/bin/env python3
"""
Лёгкий C-only judge, совместимый с Judge0 API.
Только GCC, ~200 МБ вместо 8 ГБ полного Judge0.

Безопасность:
  - Токен в заголовке X-Judge-Token (обязателен)
  - Таймаут компиляции и выполнения
  - Лимиты памяти/CPU через resource.setrlimit
  - Запуск от непривилегированного пользователя
  - Изоляция в Docker-контейнере с лимитами
"""
import os
import base64
import hmac
import shutil
import signal
import subprocess
import tempfile
import resource
from flask import Flask, request, jsonify

app = Flask(__name__)
# Защита от раздувания тела запроса: отклоняем всё крупнее 1 МБ до парсинга
app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024

# Секретный токен (задаётся через переменную окружения JUDGE_TOKEN)
JUDGE_TOKEN = os.environ.get("JUDGE_TOKEN", "")

COMPILE_TIMEOUT = 20      # сек на компиляцию
RUN_TIMEOUT = 5           # сек на выполнение
MEM_LIMIT_BYTES = 256 * 1024 * 1024   # 256 МБ адресного пространства
MAX_OUTPUT = 1_000_000    # обрезка вывода

# Judge0 status IDs
ST_ACCEPTED = 3
ST_TIME_LIMIT = 5
ST_COMPILE_ERROR = 6
ST_RUNTIME_ERROR = 8
ST_INTERNAL_ERROR = 13


def _resp(status_id, description, **kw):
    body = {
        "status": {"id": status_id, "description": description},
        "stdout": "",
        "stderr": "",
        "compile_output": "",
        "time": "0",
        "memory": "0",
    }
    body.update(kw)
    return jsonify(body)


def _maybe_b64(value, flag):
    """Декодирует base64 если запрошен флаг, иначе возвращает как есть."""
    if value is None:
        return ""
    if flag:
        try:
            return base64.b64decode(value).decode("utf-8", "replace")
        except Exception:
            return value if isinstance(value, str) else ""
    return value if isinstance(value, str) else ""


def _set_limits():
    """Лимиты для дочернего процесса (вызывается в preexec_fn)."""
    try:
        resource.setrlimit(resource.RLIMIT_AS, (MEM_LIMIT_BYTES, MEM_LIMIT_BYTES))
    except (ValueError, resource.error):
        pass
    try:
        resource.setrlimit(resource.RLIMIT_CPU, (RUN_TIMEOUT, RUN_TIMEOUT + 1))
    except (ValueError, resource.error):
        pass
    # Запрет fork-бомб: не создавать дочерних процессов
    try:
        resource.setrlimit(resource.RLIMIT_NPROC, (0, 0))
    except (ValueError, resource.error):
        pass
    # Ограничить размер создаваемых файлов
    try:
        resource.setrlimit(resource.RLIMIT_FSIZE, (16 * 1024 * 1024, 16 * 1024 * 1024))
    except (ValueError, resource.error):
        pass


@app.route("/submissions", methods=["POST"])
@app.route("/submissions/", methods=["POST"])
def submissions():
    # Проверка токена
    if not JUDGE_TOKEN:
        return _resp(ST_INTERNAL_ERROR, "Internal Error",
                     stderr="JUDGE_TOKEN not configured on server")
    token = request.headers.get("X-Judge-Token", "")
    if not hmac.compare_digest(token, JUDGE_TOKEN):
        return jsonify({"error": "unauthorized"}), 401

    data = request.get_json(silent=True) or {}

    b64 = (request.args.get("base64_encoded", "false").lower() == "true"
           or bool(data.get("base64_encoded")))

    source = _maybe_b64(data.get("source_code", ""), b64)
    stdin_data = _maybe_b64(data.get("stdin", ""), b64)

    if not source.strip():
        return _resp(ST_COMPILE_ERROR, "Compilation Error",
                     compile_output="Empty source code")

    workdir = tempfile.mkdtemp(prefix="judge_")
    try:
        src_path = os.path.join(workdir, "main.c")
        exe_path = os.path.join(workdir, "main")
        with open(src_path, "w") as f:
            f.write(source)

        # --- Компиляция ---
        try:
            comp = subprocess.run(
                ["gcc", src_path, "-o", exe_path, "-lm", "-O2", "-w",
                 "-fno-strict-aliasing"],
                capture_output=True, text=True, timeout=COMPILE_TIMEOUT
            )
        except subprocess.TimeoutExpired:
            return _resp(ST_COMPILE_ERROR, "Compilation Error",
                         compile_output="Compilation timed out")

        if comp.returncode != 0:
            return _resp(ST_COMPILE_ERROR, "Compilation Error",
                         compile_output=comp.stderr[:MAX_OUTPUT])

        # --- Выполнение ---
        try:
            run = subprocess.run(
                [exe_path], input=stdin_data, capture_output=True,
                text=True, timeout=RUN_TIMEOUT, preexec_fn=_set_limits
            )
        except subprocess.TimeoutExpired:
            return _resp(ST_TIME_LIMIT, "Time Limit Exceeded",
                         time=str(RUN_TIMEOUT))

        # Ненулевой код возврата = runtime error (segfault и т.п.)
        if run.returncode != 0:
            sig = ""
            if run.returncode < 0:
                try:
                    sig = f" (signal {signal.Signals(-run.returncode).name})"
                except (ValueError, AttributeError):
                    sig = f" (signal {-run.returncode})"
            return _resp(ST_RUNTIME_ERROR, "Runtime Error",
                         stdout=run.stdout[:MAX_OUTPUT],
                         stderr=(run.stderr or f"Process exited with code "
                                 f"{run.returncode}{sig}")[:MAX_OUTPUT])

        return _resp(ST_ACCEPTED, "Accepted",
                     stdout=run.stdout[:MAX_OUTPUT],
                     stderr=run.stderr[:MAX_OUTPUT])

    except Exception as e:  # noqa: BLE001
        return _resp(ST_INTERNAL_ERROR, "Internal Error", stderr=str(e)[:MAX_OUTPUT])
    finally:
        shutil.rmtree(workdir, ignore_errors=True)


@app.route("/about", methods=["GET"])
def about():
    return jsonify({
        "message": "Lightweight C-only judge (Judge0-compatible API)",
        "languages": ["C (GCC)"],
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=2358)
