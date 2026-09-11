import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Простое in-memory rate limiting (для production используйте Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Очистка старых записей каждые 5 минут
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export function middleware(request: NextRequest) {
  // Rate limiting только для API чата
  if (request.nextUrl.pathname === '/api/chat') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // 10 запросов в минуту на IP
    if (!rateLimit(ip, 10, 60 * 1000)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Слишком много запросов. Подождите минуту и попробуйте снова.'
        },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/chat',
};
