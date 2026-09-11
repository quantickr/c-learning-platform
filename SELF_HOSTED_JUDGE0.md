# Развертывание собственного Judge0 на Railway

Установите свой Judge0 сервер для **НЕОГРАНИЧЕННЫХ** запросов компиляции!

## 🚀 Преимущества

- ✅ **НЕОГРАНИЧЕННЫЕ** запросы
- ✅ Полностью бесплатно (входит в $5 Railway)
- ✅ Быстрее (нет внешних API)
- ✅ Полный контроль
- ✅ Приватный сервер

## 📦 Вариант 1: Railway (рекомендуется)

### Шаг 1: Подготовка

Создайте новый репозиторий с Judge0 или используйте официальный Docker образ.

### Шаг 2: Создайте новый сервис на Railway

1. Зайдите на https://railway.app
2. New Project → Empty Project
3. Add Service → Docker Image

### Шаг 3: Настройте Docker образ

В Railway укажите:
```
judge0/judge0:1.13.0
```

### Шаг 4: Добавьте переменные окружения

```env
REDIS_HOST=redis
REDIS_PORT=6379
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=judge0
POSTGRES_USER=judge0
POSTGRES_PASSWORD=YourSecurePassword123
```

### Шаг 5: Добавьте Redis и PostgreSQL

В том же проекте:
- New Service → Database → Redis
- New Service → Database → PostgreSQL

Railway автоматически свяжет сервисы.

### Шаг 6: Получите URL

После деплоя Railway даст URL типа:
```
https://your-judge0.up.railway.app
```

## 🔧 Вариант 2: Docker Compose (для VPS)

Если у вас есть VPS (Timeweb, DigitalOcean и т.д.):

```yaml
# docker-compose.yml
version: '3.8'

services:
  judge0:
    image: judge0/judge0:1.13.0
    ports:
      - "2358:2358"
    environment:
      - REDIS_HOST=redis
      - POSTGRES_HOST=postgres
      - POSTGRES_DB=judge0
      - POSTGRES_USER=judge0
      - POSTGRES_PASSWORD=YourSecurePassword
    depends_on:
      - redis
      - postgres
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=judge0
      - POSTGRES_USER=judge0
      - POSTGRES_PASSWORD=YourSecurePassword
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres-data:
```

Запуск:
```bash
docker-compose up -d
```

## 🔌 Подключение к платформе

### Обновите API endpoint

В вашем проекте создайте новый endpoint или обновите существующий:

```typescript
// app/api/compile-self-hosted/route.ts
const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';

export async function POST(request: NextRequest) {
  const { code, input } = await request.json();
  
  // Создаём submission
  const submitResponse = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: code,
      language_id: 50, // C (GCC 9.2.0)
      stdin: input || '',
      cpu_time_limit: 2,
      memory_limit: 128000,
    }),
  });

  const result = await submitResponse.json();
  
  // Обработка результата
  if (result.status.id === 3) {
    return NextResponse.json({
      success: true,
      output: result.stdout || '',
    });
  } else {
    return NextResponse.json({
      success: false,
      error: result.stderr || result.compile_output || 'Ошибка выполнения',
    });
  }
}
```

### Добавьте переменную окружения

**Локально (.env.local):**
```env
JUDGE0_URL=http://localhost:2358
```

**На Railway (для вашего приложения):**
```env
JUDGE0_URL=https://your-judge0.up.railway.app
```

## 📊 Стоимость

**Railway:**
- Judge0 + Redis + PostgreSQL входят в $5/месяц
- Всё бесплатно первый месяц
- Неограниченные запросы

**VPS:**
- От 200₽/месяц (Timeweb)
- От $4/месяц (DigitalOcean, Hetzner)
- Полный контроль

## ⚡ Производительность

Свой Judge0:
- ~100-300ms на запрос
- Параллельная обработка
- Нет лимитов rate limiting

Внешние API:
- ~500-1500ms на запрос
- Лимиты запросов
- Зависимость от их доступности

## 🔒 Безопасность

Judge0 изолирует выполнение кода в контейнерах, но рекомендуется:
- Не открывать порт публично (только для вашего приложения)
- Установить authentication если нужен публичный доступ
- Мониторить использование ресурсов

## 🆘 Помощь

Если нужна помощь с настройкой:
1. Railway автоматически настраивает большую часть
2. Проверьте логи в Railway Dashboard
3. Убедитесь что все 3 сервиса запущены

---

**Следующий шаг:** Хотите, я настрою это для вас?
