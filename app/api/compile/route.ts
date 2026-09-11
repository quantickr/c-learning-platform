import { NextRequest, NextResponse } from 'next/server';

interface CompileRequest {
  code: string;
  input: string;
}

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { code, input } = await request.json() as CompileRequest;

    // Используем Judge0 API для компиляции и запуска кода
    const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: 50, // C (GCC 9.2.0)
        stdin: input,
        cpu_time_limit: 2,
        memory_limit: 128000
      })
    });

    if (!response.ok) {
      // Если API недоступен, используем локальную компиляцию (если возможно)
      return NextResponse.json({
        success: false,
        error: 'Сервис компиляции временно недоступен. Попробуйте позже.'
      });
    }

    const result = await response.json();

    // Проверяем результат
    if (result.status.id === 3) {
      // Успешное выполнение
      return NextResponse.json({
        success: true,
        output: result.stdout || '',
        error: result.stderr || ''
      });
    } else if (result.status.id === 6) {
      // Ошибка компиляции
      return NextResponse.json({
        success: false,
        error: result.compile_output || 'Ошибка компиляции'
      });
    } else if (result.status.id === 11) {
      // Runtime error
      return NextResponse.json({
        success: false,
        error: result.stderr || 'Ошибка выполнения'
      });
    } else {
      // Другие ошибки
      return NextResponse.json({
        success: false,
        error: result.message || `Ошибка: ${result.status.description}`
      });
    }
  } catch (error) {
    console.error('Compilation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Произошла ошибка при компиляции кода'
    });
  }
}
