# 🚀 Быстрый старт с собственным Judge0

**НЕОГРАНИЧЕННЫЕ запросы!** Развернуть свой Judge0 за 5 минут.

## ⚡ Локально (для разработки)

### Вариант 1: Автоматический скрипт

```bash
# Запустить Judge0
./start-judge0.sh

# Добавить в .env.local
echo "JUDGE0_URL=http://localhost:2358" >> .env.local

# Готово!
```

### Вариант 2: Вручную

```bash
# Запустить
docker-compose -f docker-compose.judge0.yml up -d

# Подождать 30 секунд
sleep 30

# Проверить
curl http://localhost:2358/about

# Добавить в .env.local
JUDGE0_URL=http://localhost:2358
```

## 🌐 На Railway (для production)

### Быстрый способ

1. Зайдите на https://railway.app
2. New Project → Empty Project
3. Add Service → Database → PostgreSQL
4. Add Service → Database → Redis  
5. Add Service → Docker Image: `judge0/judge0:1.13.0`
6. В Judge0 сервисе добавьте переменные:
   ```
   REDIS_HOST=${{Redis.REDIS_PRIVATE_URL}}
   POSTGRES_HOST=${{Postgres.DATABASE_HOST}}
   POSTGRES_PORT=${{Postgres.DATABASE_PORT}}
   POSTGRES_DB=${{Postgres.DATABASE_NAME}}
   POSTGRES_USER=${{Postgres.DATABASE_USER}}
   POSTGRES_PASSWORD=${{Postgres.DATABASE_PASSWORD}}
   ENABLE_WAIT_RESULT=true
   ```
7. Получите URL типа: `https://judge0-xxx.railway.app`
8. В **вашем приложении** добавьте переменную:
   ```
   JUDGE0_URL=https://judge0-xxx.railway.app
   ```

## 🔌 Подключение к платформе

Обновите CodeEditor чтобы использовать новый endpoint:

```typescript
// В components/CodeEditor.tsx
const response = await axios.post('/api/compile-self-hosted', {
  code: fullCode,
  input: test.input
});
```

## ✅ Преимущества

- ✅ **НЕОГРАНИЧЕННЫЕ** запросы
- ✅ Быстрее (100-300ms vs 500-1500ms)
- ✅ Полный контроль
- ✅ Нет зависимости от внешних API
- ✅ Приватный сервер

## 📊 Стоимость

**Локально:** Бесплатно (только Docker)
**Railway:** Входит в $5/месяц бесплатно

## 🔧 Управление

```bash
# Остановить
docker-compose -f docker-compose.judge0.yml down

# Логи
docker-compose -f docker-compose.judge0.yml logs -f judge0-server

# Перезапуск
docker-compose -f docker-compose.judge0.yml restart

# Статус
docker-compose -f docker-compose.judge0.yml ps
```

## 🆘 Проблемы?

**Judge0 не запускается:**
- Проверьте что Docker запущен
- Убедитесь что порт 2358 свободен
- Посмотрите логи: `docker-compose -f docker-compose.judge0.yml logs`

**Не подключается:**
- Проверьте JUDGE0_URL в .env.local
- Убедитесь что Judge0 доступен: `curl http://localhost:2358/about`
- Перезапустите dev сервер

---

**Рекомендация:** Используйте локально для разработки, Railway для production!
