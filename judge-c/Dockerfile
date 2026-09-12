# Лёгкий C-only judge (~200 МБ)
FROM python:3.11-slim

# Устанавливаем только GCC и минимум необходимого
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

# Python-зависимости
RUN pip install --no-cache-dir flask gunicorn

WORKDIR /app
COPY server.py .

# Непривилегированный пользователь
RUN useradd -m -u 1001 judge
USER judge

EXPOSE 2358

# gunicorn: 2 воркера, таймаут 30 сек
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:2358", "--timeout", "30", "server:app"]
