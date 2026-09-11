import { NextRequest, NextResponse } from 'next/server';

// Piston API - бесплатный публичный API для компиляции кода
const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

export async function POST(request: NextRequest) {
  try {
    const { code, input } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Код не может быть пустым' },
        { status: 400 }
      );
    }

    // Отправляем код на Piston API
    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'c',
        version: '10.2.0', // GCC 10.2.0
        files: [
          {
            name: 'main.c',
            content: code,
          },
        ],
        stdin: input || '',
        compile_timeout: 10000, // 10 секунд на компиляцию
        run_timeout: 3000, // 3 секунды на выполнение
        compile_memory_limit: 100000000, // 100 MB
        run_memory_limit: 100000000, // 100 MB
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ошибка сервера компиляции'
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Обрабатываем результат от Piston
    if (data.compile && data.compile.code !== 0) {
      // Ошибка компиляции
      return NextResponse.json({
        success: false,
        error: data.compile.stderr || data.compile.output || 'Ошибка компиляции',
        compilationError: true,
      });
    }

    if (data.run && data.run.code !== 0 && data.run.signal) {
      // Ошибка выполнения (сегфолт, таймаут и т.д.)
      let errorMessage = 'Ошибка выполнения';

      if (data.run.signal === 'SIGTERM') {
        errorMessage = 'Превышено время выполнения';
      } else if (data.run.signal === 'SIGSEGV') {
        errorMessage = 'Segmentation fault (ошибка доступа к памяти)';
      } else if (data.run.stderr) {
        errorMessage = data.run.stderr;
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        runtimeError: true,
      });
    }

    // Успешное выполнение
    const output = data.run?.stdout || data.run?.output || '';
    const stderr = data.run?.stderr || '';

    return NextResponse.json({
      success: true,
      output: output.trim(),
      stderr: stderr.trim(),
    });

  } catch (error: any) {
    console.error('Piston API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Ошибка при компиляции кода'
      },
      { status: 500 }
    );
  }
}
