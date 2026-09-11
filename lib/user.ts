import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function getUserId(): Promise<string> {
  const cookieStore = await cookies();
  let userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    userId = uuidv4();
    // Cookie живёт 1 год
    cookieStore.set('user_id', userId, {
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
  }

  return userId;
}

export interface UserProgress {
  userId: string;
  completedTasks: number[];
  lastAccess: string;
  statistics: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    tasksAttempted: number;
  };
}
