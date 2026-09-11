import { NextRequest, NextResponse } from 'next/server';

// Самостоятельно развернутый Judge0 - НЕОГРАНИЧЕННЫЕ запросы!
// См. SELF_HOSTED_JUDGE0.md для настройки

const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';

export async function POST(request: NextRequest) {
  try {
    const { code, input } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Код не может быть пустым' },
        { status: 400 }
      );
    }

    // Создаём submission в Judge0
    const submitResponse = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
          error: 'Ошибка сервера компиляции. Убедитесь что Judge0 запущен.'
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
      // Runtime error (например, segfault)
      return NextResponse.json({
        success: false,
        error: result.stderr || 'Ошибка выполнения',
        runtimeError: true,
      });
    } else if (result.status.id === 7) {
      // Превышено время выполнения
      return NextResponse.json({
        success: false,
        error: 'Превышено время выполнения (2 секунды)',
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

    // Более информативное сообщение об ошибке
    let errorMessage = 'Ошибка подключения к Judge0';

    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Judge0 недоступен. Убедитесь что сервер запущен на ' + JUDGE0_URL;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        hint: 'Проверьте переменную окружения JUDGE0_URL и доступность сервера'
      },
      { status: 500 }
    );
  }
}
