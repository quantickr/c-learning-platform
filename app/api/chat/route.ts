import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Сообщение не может быть пустым' },
        { status: 400 }
      );
    }

    // Подключение к локальному Ollama с Qwen
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

    // Формируем системный промпт для помощи с C
    const systemPrompt = `Ты - помощник по программированию на языке C. Помогаешь студентам понять основы языка C, решить задачи и объясняешь концепции простым языком. Отвечай кратко и по делу. Если студент задаёт вопрос о задаче, помоги с логикой, но не давай готовое решение полностью - направь его в правильную сторону.`;

    const fullPrompt = context
      ? `${systemPrompt}\n\nКонтекст задачи:\n${context}\n\nВопрос студента: ${message}`
      : `${systemPrompt}\n\nВопрос студента: ${message}`;

    // Запрос к Ollama API
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen2.5-coder:latest',
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      }),
    });

    if (!response.ok) {
      // Если Ollama недоступен, возвращаем fallback ответ
      return NextResponse.json({
        success: false,
        message: 'Локальная модель Qwen недоступна. Убедитесь, что Ollama запущен (ollama serve) и модель установлена (ollama pull qwen2.5-coder:latest).',
        fallback: true
      });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      response: data.response,
      model: 'qwen2.5-coder'
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Ошибка при обращении к AI помощнику',
      fallback: true
    });
  }
}
