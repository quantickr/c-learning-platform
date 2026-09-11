# Деплой на Vercel

Пошаговая инструкция по развертыванию платформы на Vercel с уникальными данными для каждого пользователя.

## 🚀 Быстрый деплой

### 1. Подготовка

Убедитесь что:
- Код закоммичен в Git репозиторий
- У вас есть аккаунт на [Vercel](https://vercel.com)

### 2. Деплой через Vercel CLI

```bash
# Установите Vercel CLI
npm install -g vercel

# Залогиньтесь
vercel login

# Деплой
vercel
```

### 3. Деплой через GitHub (рекомендуется)

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите **"Add New Project"**
3. Импортируйте ваш GitHub репозиторий
4. Настройте переменные окружения (см. ниже)
5. Нажмите **"Deploy"**

## 🔐 Переменные окружения

Добавьте в настройках проекта Vercel:

```env
# Judge0 API (обязательно)
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com

# Ollama (опционально, для AI помощника)
OLLAMA_URL=http://localhost:11434
```

**Важно:** На Vercel AI помощник работать не будет, т.к. Ollama требует локального сервера. Для production AI можно интегрировать OpenAI API или другие облачные LLM.

## 👤 Система пользователей

### Как работает

Платформа автоматически создаёт уникальный ID для каждого пользователя:

1. **При первом визите** - генерируется UUID и сохраняется в cookie
2. **Cookie живёт 1 год** - пользователь остаётся тем же при возврате
3. **Прогресс сохраняется** - решённые задачи, статистика тестов

### Хранение данных

**Локально (dev):**
- In-memory Map (исчезает при перезапуске)

**На Vercel (production):**
Для персистентного хранилища используйте один из вариантов:

#### Вариант 1: Vercel KV (рекомендуется)

```bash
# Установите @vercel/kv
npm install @vercel/kv
```

Обновите `app/api/progress/route.ts`:

```typescript
import { kv } from '@vercel/kv';

async function getProgress(userId: string) {
  return await kv.get(`progress:${userId}`) || defaultProgress;
}

async function saveProgress(userId: string, progress: any) {
  await kv.set(`progress:${userId}`, progress);
}
```

В Vercel Dashboard:
1. Storage → Create Database → KV
2. Подключите к проекту
3. Переменные добавятся автоматически

#### Вариант 2: MongoDB Atlas

```bash
npm install mongodb
```

```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('learning-platform');

async function getProgress(userId: string) {
  return await db.collection('progress').findOne({ userId });
}

async function saveProgress(userId: string, progress: any) {
  await db.collection('progress').updateOne(
    { userId },
    { $set: progress },
    { upsert: true }
  );
}
```

Добавьте в Vercel:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
```

#### Вариант 3: Upstash Redis

```bash
npm install @upstash/redis
```

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function getProgress(userId: string) {
  return await redis.get(`progress:${userId}`);
}

async function saveProgress(userId: string, progress: any) {
  await redis.set(`progress:${userId}`, progress);
}
```

## 📊 Что отслеживается

Для каждого пользователя:

- ✅ Решённые задачи (список ID)
- 📈 Статистика:
  - Всего тестов запущено
  - Тестов пройдено
  - Тестов провалено
  - Задач попробовано
- 🕐 Последний визит
- 🆔 Уникальный UUID

## 🎯 Профиль пользователя

Кнопка **"👤 Профиль"** в правом верхнем углу показывает:
- ID пользователя
- Количество решённых задач
- Статистику тестов
- Процент успешности
- Список решённых задач

## 🔄 Автосохранение

Прогресс сохраняется автоматически:
- При запуске тестов
- При успешном решении задачи
- Не требует регистрации
- Работает через cookie

## 🧹 Сброс данных

Пользователь может сбросить свои данные:
- Удалить cookie `user_id`
- Очистить localStorage (код решений)

## 📱 Мобильные устройства

Cookie работают на всех устройствах. Один пользователь = одно устройство/браузер.

## 🔒 Приватность

- Не собираем личную информацию
- Только анонимный UUID
- Нет регистрации/логинов
- Cookie используются только для сохранения прогресса

## 🚨 Ограничения

**Без Vercel KV/MongoDB:**
- Данные исчезают при рестарте сервера
- Не подходит для production

**С Vercel KV/MongoDB:**
- Персистентное хранилище
- Работает бесконечно
- Подходит для production

## 📝 Рекомендации

1. **Для dev** - оставьте in-memory хранилище
2. **Для production** - используйте Vercel KV (быстро и просто)
3. **Для масштаба** - используйте MongoDB или Postgres
4. **Мониторинг** - следите за количеством пользователей

## 🎉 После деплоя

1. Откройте ваш сайт на Vercel
2. Проверьте работу задач
3. Проверьте сохранение прогресса
4. Откройте профиль пользователя

Готово! 🚀
