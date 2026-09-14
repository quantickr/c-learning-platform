import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Простое in-memory rate limiting (для production используйте Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_MAP_SIZE = 10000; // Защита от memory exhaustion

// Очистка старых записей каждые 5 минут
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Валидация IP адреса
function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// Получение IP с защитой от spoofing
function getClientIP(request: NextRequest): string {
  // В production за reverse proxy (Vercel, Cloudflare) можно доверять x-forwarded-for
  // Для самостоятельного деплоя - настройте trusted proxies
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    const clientIP = ips[0]; // Первый IP - клиент

    // Валидируем IP перед использованием
    if (isValidIP(clientIP)) {
      return clientIP;
    }
  }

  // Fallback: x-real-ip
  const realIP = request.headers.get('x-real-ip');
  if (realIP && isValidIP(realIP)) {
    return realIP;
  }

  // Последний fallback - используем "anonymous" вместо невалидного IP
  return 'anonymous';
}

// Ключ — не голый IP, а `${ip}:${область}`: у чата и у компиляции разные
// лимиты, и на общем счётчике десяток прогонов тестов молча блокировал бы
// ещё и ассистента.
function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Защита от memory exhaustion - LRU eviction при превышении лимита
    if (rateLimitMap.size >= MAX_MAP_SIZE) {
      const oldestKey = rateLimitMap.keys().next().value;
      if (oldestKey) {
        rateLimitMap.delete(oldestKey);
      }
    }

    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const ip = getClientIP(request);

  // Rate limiting для API чата
  if (pathname === '/api/chat') {
    // 10 запросов в минуту на IP
    if (!rateLimit(`${ip}:chat`, 10, 60 * 1000)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Слишком много запросов. Подождите минуту и попробуйте снова.'
        },
        { status: 429 }
      );
    }
  }

  // Rate limiting для компиляции кода
  if (pathname.startsWith('/api/compile')) {
    // 120 запросов в минуту на IP. Один прогон тестов — это один запрос на
    // тест: в самой длинной задаче их 18, так что прежние 30 в минуту
    // кончались на втором запуске подряд и ученик получал 429 посреди проверки.
    if (!rateLimit(`${ip}:compile`, 120, 60 * 1000)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Слишком много запросов компиляции. Подождите минуту.'
        },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/chat', '/api/compile', '/api/compile-jdoodle', '/api/compile-self-hosted', '/api/compile-piston'],
};
