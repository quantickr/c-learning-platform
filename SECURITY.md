# Безопасность платформы

## 🔒 Реализованные меры защиты

### 1. Rate Limiting

**API endpoints защищены от злоупотребления:**
- `/api/chat` - 10 запросов/минуту на IP
- `/api/compile*` - 30 запросов/минуту на IP

**Технология:** In-memory rate limiting с автоочисткой
**Production:** Рекомендуется Redis/Upstash для распределённых систем

### 2. SSRF Protection (Server-Side Request Forgery)

**Endpoint:** `/api/compile-self-hosted`

**Защита:**
- Валидация протокола (только http/https)
- Whitelist разрешённых хостов (localhost, *.railway.app)
- Блокировка приватных IP диапазонов
- Валидация URL перед каждым запросом

**Разрешённые хосты:**
```typescript
const ALLOWED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '::1',
];
// + домены *.railway.app
```

### 3. Input Validation

**Все API endpoints:**
- Максимальный размер кода: 100KB
- Максимальный размер входных данных: 10KB
- Общее ограничение тела запроса: 1MB (next.config.ts)

### 4. Error Handling

**Защита от информационных утечек:**
- Внутренние URL не показываются пользователям
- Детальные ошибки только в server logs
- Общие сообщения об ошибках для клиентов

### 5. Credentials Management

**Docker Compose:**
- Все пароли через переменные окружения
- Дефолтные значения помечены как небезопасные
- Redis требует аутентификацию
- PostgreSQL требует аутентификацию

**Production требования:**
```bash
# Генерация безопасных паролей
openssl rand -base64 32
```

## ⚠️ Известные риски

### 1. Judge0 Privileged Mode

**Риск:** Judge0 требует `privileged: true` для sandboxing
**Уровень:** MEDIUM
**Митигация:**
- Используйте только на изолированных хостах
- Рассмотрите запуск в отдельной VM
- Не размещайте чувствительные данные на том же хосте
- Настройте сетевую изоляцию

### 2. In-Memory Rate Limiting

**Риск:** Не работает при горизонтальном масштабировании
**Уровень:** LOW (для текущего масштаба)
**Митигация для production:**
```typescript
// Используйте Redis для распределённого rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});
```

## 🛡️ Рекомендации для production

### 1. Обязательно

- [ ] Установите сильные пароли для JUDGE0_POSTGRES_PASSWORD и JUDGE0_REDIS_PASSWORD
- [ ] Используйте HTTPS для всех публичных endpoints
- [ ] Настройте CORS если нужно
- [ ] Добавьте аутентификацию если API должен быть приватным
- [ ] Мониторьте использование rate limits

### 2. Рекомендуется

- [ ] Переключите rate limiting на Redis/Upstash
- [ ] Добавьте логирование подозрительной активности
- [ ] Настройте alerts на превышение лимитов
- [ ] Регулярно обновляйте зависимости
- [ ] Проводите security audits

### 3. Опционально

- [ ] WAF (Web Application Firewall)
- [ ] DDoS protection (Cloudflare, Railway built-in)
- [ ] Automated security scanning (Dependabot, Snyk)
- [ ] Penetration testing

## 🔐 Настройка переменных окружения

### Локальная разработка

```bash
# .env.local
JUDGE0_URL=http://localhost:2358
JUDGE0_POSTGRES_PASSWORD=$(openssl rand -base64 32)
JUDGE0_REDIS_PASSWORD=$(openssl rand -base64 32)
```

### Railway Production

В Railway Dashboard → Variables:
```
JUDGE0_URL=https://your-judge0.railway.app
JUDGE0_POSTGRES_PASSWORD=<сгенерированный_пароль>
JUDGE0_REDIS_PASSWORD=<сгенерированный_пароль>
```

## 📊 Мониторинг

### Что отслеживать

1. **Rate limit hits** - сколько запросов блокируется
2. **Failed validations** - попытки SSRF или invalid input
3. **Error rates** - высокий процент ошибок может указывать на атаку
4. **Resource usage** - CPU/Memory Judge0 контейнеров

### Логи для анализа

```bash
# Railway
railway logs

# Docker local
docker-compose -f docker-compose.judge0.yml logs -f

# Поиск подозрительной активности
grep "429" logs.txt  # Rate limit hits
grep "Invalid" logs.txt  # Validation failures
```

## 🚨 Реакция на инциденты

### Если обнаружена атака:

1. **Немедленно:** Включите режим обслуживания
2. Проверьте логи на аномалии
3. Обновите rate limits если нужно
4. Заблокируйте IP злоумышленника (на уровне Railway/Cloudflare)
5. Смените credentials если были скомпрометированы
6. Проведите post-mortem анализ

## 📚 Дополнительные ресурсы

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Railway Security Best Practices](https://docs.railway.app/guides/security)
- [Judge0 Security](https://github.com/judge0/judge0/blob/master/CHANGELOG.md#security)
