import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/user';

// Для Vercel KV используем: npm install @vercel/kv
// Для локальной разработки используем in-memory хранилище

// In-memory хранилище для локальной разработки
const localProgress = new Map<string, any>();

async function getProgress(userId: string) {
  // В production с Vercel KV:
  // const kv = createClient({ ... });
  // return await kv.get(`progress:${userId}`);

  // Локально:
  return localProgress.get(userId) || {
    completedTasks: [],
    lastAccess: new Date().toISOString(),
    statistics: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      tasksAttempted: 0,
    }
  };
}

async function saveProgress(userId: string, progress: any) {
  // В production с Vercel KV:
  // const kv = createClient({ ... });
  // await kv.set(`progress:${userId}`, progress);

  // Локально:
  localProgress.set(userId, progress);
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const progress = await getProgress(userId);

    return NextResponse.json({
      success: true,
      userId,
      progress
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await request.json();

    const { taskId, passed, testsTotal, testsPassed } = body;

    if (!taskId || typeof passed !== 'boolean') {
      return NextResponse.json({
        success: false,
        error: 'Некорректные данные'
      }, { status: 400 });
    }

    // Получаем текущий прогресс
    const progress = await getProgress(userId);

    // Обновляем прогресс
    if (passed && !progress.completedTasks.includes(taskId)) {
      progress.completedTasks.push(taskId);
    }

    progress.lastAccess = new Date().toISOString();
    progress.statistics.totalTests += testsTotal || 0;
    progress.statistics.passedTests += testsPassed || 0;
    progress.statistics.failedTests += (testsTotal || 0) - (testsPassed || 0);

    if (!progress.completedTasks.includes(taskId)) {
      progress.statistics.tasksAttempted = Math.max(
        progress.statistics.tasksAttempted,
        taskId
      );
    }

    // Сохраняем
    await saveProgress(userId, progress);

    return NextResponse.json({
      success: true,
      userId,
      progress
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
