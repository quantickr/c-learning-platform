import { NextRequest, NextResponse } from 'next/server';

// Самостоятельно развернутый Judge0 - НЕОГРАНИЧЕННЫЕ запросы!
// См. SELF_HOSTED_JUDGE0.md для настройки

const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';
const JUDGE0_TOKEN = process.env.JUDGE0_TOKEN || '';

// Валидация URL для защиты от SSRF
const ALLOWED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '::1',
  '176.57.218.50', // Timeweb VPS с лёгким C-judge
  // Добавьте ваши Railway/VPS хосты сюда
];

function validateJudge0URL(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    // Проверка протокола
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    // Проверка хоста (разрешаем localhost и Railway домены)
    const hostname = url.hostname.toLowerCase();
    if (ALLOWED_HOSTS.includes(hostname) || hostname.endsWith('.railway.app')) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Валидация размера запроса
    const body = await request.json();
    const { code, input } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Код не может быть пустым' },
        { status: 400 }
      );
    }

    // Ограничение размера кода и входных данных
    if (code.length > 100000) {
      return NextResponse.json(
        { success: false, error: 'Код слишком большой (максимум 100KB)' },
        { status: 413 }
      );
    }

    if (input && input.length > 10000) {
      return NextResponse.json(
        { success: false, error: 'Входные данные слишком большие (максимум 10KB)' },
        { status: 413 }
      );
    }

    // Валидация JUDGE0_URL для защиты от SSRF
    if (!validateJudge0URL(JUDGE0_URL)) {
      console.error('Invalid JUDGE0_URL:', JUDGE0_URL);
      return NextResponse.json(
        {
          success: false,
          error: 'Неверная конфигурация сервера компиляции'
        },
        { status: 500 }
      );
    }

    // Создаём submission в Judge0
    const submitResponse = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Judge-Token': JUDGE0_TOKEN,
        },
        body: JSON.stringify({
          source_code: code,
          language_id: 50, // C (GCC 9.2.0)
          stdin: input || '',
          cpu_time_limit: 2, // 2 секунды
          memory_limit: 128000, // 128 MB
          wall_time_limit: 5, // 5 секунд максимум
          max_file_size: 1024, // 1 MB
        }),
      }
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error('Judge0 API error:', errorText);
      return NextResponse.json(
        {
          success: false,
          error: 'Ошибка сервера компиляции'
        },
        { status: 500 }
      );
    }

    const result = await submitResponse.json();

    // Judge0 status codes:
    // 1-2: В очереди/обработке
    // 3: Успешно
    // 4: Ошибка компиляции
    // 5: Ошибка времени выполнения
    // 6-14: Различные ошибки

    if (result.status.id === 3) {
      // Успешное выполнение
      return NextResponse.json({
        success: true,
        output: (result.stdout || '').trim(),
        time: result.time,
        memory: result.memory,
      });
    } else if (result.status.id === 6) {
      // Ошибка компиляции
      return NextResponse.json({
        success: false,
        error: result.compile_output || 'Ошибка компиляции',
        compilationError: true,
      });
    } else if (result.status.id === 5) {
      // Превышено время выполнения
      return NextResponse.json({
        success: false,
        error: 'Превышено время выполнения (5 секунд)',
        runtimeError: true,
      });
    } else if (result.status.id === 8) {
      // Runtime error (например, segfault)
      return NextResponse.json({
        success: false,
        error: result.stderr || 'Ошибка выполнения',
        runtimeError: true,
      });
    } else {
      // Другие ошибки
      return NextResponse.json({
        success: false,
        error: result.stderr || result.message || `Ошибка: ${result.status.description}`,
        runtimeError: true,
      });
    }

  } catch (error: any) {
    console.error('Judge0 connection error:', error);

    // Не раскрываем внутренние URL в сообщениях об ошибках
    let errorMessage = 'Ошибка подключения к серверу компиляции';

    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Сервер компиляции недоступен. Обратитесь к администратору.';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
