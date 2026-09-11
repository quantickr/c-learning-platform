import { NextRequest, NextResponse } from 'next/server';

// JDoodle API - бесплатно 200 запросов/день
// Зарегистрируйтесь на https://www.jdoodle.com/compiler-api для получения ключей

const JDOODLE_CLIENT_ID = process.env.JDOODLE_CLIENT_ID || 'demo-client-id';
const JDOODLE_CLIENT_SECRET = process.env.JDOODLE_CLIENT_SECRET || 'demo-secret';

export async function POST(request: NextRequest) {
  try {
    const { code, input } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Код не может быть пустым' },
        { status: 400 }
      );
    }

    // Отправляем код на JDoodle API
    const response = await fetch('https://api.jdoodle.com/v1/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: JDOODLE_CLIENT_ID,
        clientSecret: JDOODLE_CLIENT_SECRET,
        script: code,
        stdin: input || '',
        language: 'c',
        versionIndex: '4', // GCC 9.1.0
        compileOnly: false,
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

    // JDoodle возвращает memory, cpuTime, output, statusCode
    // statusCode: 0 = success, 1 = compilation error, others = runtime error

    if (data.statusCode === 1 || (data.output && data.output.includes('error:'))) {
      // Ошибка компиляции
      return NextResponse.json({
        success: false,
        error: data.output || 'Ошибка компиляции',
        compilationError: true,
      });
    }

    if (data.statusCode && data.statusCode !== 0) {
      // Ошибка выполнения
      return NextResponse.json({
        success: false,
        error: data.output || 'Ошибка выполнения',
        runtimeError: true,
      });
    }

    // Успешное выполнение
    return NextResponse.json({
      success: true,
      output: (data.output || '').trim(),
      cpuTime: data.cpuTime,
      memory: data.memory,
    });

  } catch (error: any) {
    console.error('JDoodle API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Ошибка при компиляции кода'
      },
      { status: 500 }
    );
  }
}
