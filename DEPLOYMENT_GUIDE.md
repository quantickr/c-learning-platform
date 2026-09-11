# Деплой платформы - все варианты

Платформа готова к деплою на различных хостингах. Выберите подходящий вариант.

---

## 🚀 Вариант 1: Railway.app (РЕКОМЕНДУЕТСЯ)

**Почему Railway:**
- ✅ $5 бесплатно каждый месяц
- ✅ Автоматический деплой из GitHub
- ✅ Простая настройка за 2 минуты
- ✅ Поддержка PostgreSQL/Redis бесплатно

### Шаги:

1. **Зарегистрируйтесь на [railway.app](https://railway.app)**

2. **Создайте новый проект:**
   - New Project → Deploy from GitHub repo
   - Выберите `c-learning-platform`

3. **Добавьте переменные окружения:**
   ```
   RAPIDAPI_KEY=ваш_ключ_judge0
   RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
   ```

4. **Deploy!**
   - Railway автоматически соберёт и запустит проект
   - Получите URL: `your-app.up.railway.app`

5. **Добавьте базу данных (опционально):**
   - New → Database → PostgreSQL
   - Railway автоматически подключит

**Стоимость:** $5 бесплатно/месяц (~500 часов работы)

---

## 🌐 Вариант 2: Render.com

**Почему Render:**
- ✅ Бесплатный tier навсегда
- ✅ Автодеплой из GitHub
- ✅ SSL сертификат включён
- ⚠️ Засыпает после 15 минут неактивности (бесплатный tier)

### Шаги:

1. **Зарегистрируйтесь на [render.com](https://render.com)**

2. **Создайте Web Service:**
   - New → Web Service
   - Connect GitHub → выберите репозиторий

3. **Настройки:**
   ```
   Name: c-learning-platform
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Переменные окружения:**
   ```
   NODE_ENV=production
   RAPIDAPI_KEY=ваш_ключ
   RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
   ```

5. **Deploy!**

**Стоимость:** Бесплатно (с ограничениями) или $7/месяц

---

## ☁️ Вариант 3: Timeweb Cloud

**Почему Timeweb:**
- ✅ Российский хостинг
- ✅ Полный контроль через SSH
- ✅ Поддержка Docker
- ✅ Есть тестовый период

### Шаги:

1. **Зарегистрируйтесь на [timeweb.cloud](https://timeweb.cloud)**

2. **Создайте облачный сервер:**
   - Облачные серверы → Создать сервер
   - Ubuntu 22.04
   - Минимальная конфигурация (1 CPU, 1GB RAM)

3. **Подключитесь по SSH:**
   ```bash
   ssh root@your-server-ip
   ```

4. **Установите Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

5. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/quantickr/c-learning-platform.git
   cd c-learning-platform
   ```

6. **Создайте .env файл:**
   ```bash
   nano .env.local
   ```
   
   Содержимое:
   ```env
   RAPIDAPI_KEY=ваш_ключ
   RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
   ```

7. **Соберите и запустите через Docker:**
   ```bash
   docker build -t c-platform .
   docker run -d -p 3000:3000 --env-file .env.local --name c-platform c-platform
   ```

8. **Настройте Nginx (опционально):**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Конфигурация:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

**Стоимость:** От 200₽/месяц

---

## 🐳 Вариант 4: Любой VPS с Docker

Работает на любом VPS (DigitalOcean, Hetzner, etc.)

### Быстрый старт:

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/quantickr/c-learning-platform.git
cd c-learning-platform

# 2. Создайте .env.local
echo "RAPIDAPI_KEY=your_key" > .env.local
echo "RAPIDAPI_HOST=judge0-ce.p.rapidapi.com" >> .env.local

# 3. Соберите Docker образ
docker build -t c-platform .

# 4. Запустите контейнер
docker run -d \
  -p 3000:3000 \
  --env-file .env.local \
  --restart unless-stopped \
  --name c-platform \
  c-platform

# 5. Проверьте
curl http://localhost:3000
```

---

## 💾 Добавление базы данных

### Для Railway:
1. New → Database → PostgreSQL
2. Установите `pg`: `npm install pg`
3. Используйте `DATABASE_URL` из переменных окружения

### Для Render:
1. New → PostgreSQL
2. Подключите к вашему Web Service
3. Используйте предоставленный `DATABASE_URL`

### Для Timeweb/VPS:
```bash
# Установите PostgreSQL через Docker
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=learning_platform \
  -p 5432:5432 \
  postgres:15-alpine

# Подключите к приложению
docker run -d \
  -p 3000:3000 \
  --env-file .env.local \
  -e DATABASE_URL=postgresql://postgres:password@postgres:5432/learning_platform \
  --link postgres \
  --name c-platform \
  c-platform
```

---

## 🔄 Автоматическое обновление

### Railway/Render:
- Автоматически деплоятся при push в main
- Настроено через GitHub интеграцию

### Timeweb/VPS:
Создайте webhook или используйте GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: root
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd c-learning-platform
            git pull
            docker build -t c-platform .
            docker stop c-platform
            docker rm c-platform
            docker run -d -p 3000:3000 --env-file .env.local --name c-platform c-platform
```

---

## ✅ Проверка деплоя

После успешного деплоя проверьте:

1. **Главная страница:** `https://your-domain.com`
2. **Задачи:** `https://your-domain.com/tasks`
3. **Теория:** `https://your-domain.com/theory`
4. **Профиль пользователя:** кнопка 👤 в правом верхнем углу
5. **Запуск тестов:** откройте любую задачу и попробуйте

---

## 🎯 Рекомендации

**Для начала:**
- Railway.app - самый простой и быстрый вариант

**Для production:**
- Render.com - бесплатно, но с ограничениями
- Railway.app - $5/месяц, стабильно
- Timeweb - полный контроль, от 200₽/месяц

**Для масштаба:**
- VPS + Docker + PostgreSQL
- Добавьте Redis для rate limiting
- Настройте CDN для статики

---

## 🆘 Проблемы?

Если что-то не работает:

1. Проверьте переменные окружения
2. Убедитесь что RAPIDAPI_KEY корректный
3. Проверьте логи:
   - Railway: вкладка Logs
   - Render: вкладка Logs
   - Docker: `docker logs c-platform`

Платформа готова к деплою! 🚀
