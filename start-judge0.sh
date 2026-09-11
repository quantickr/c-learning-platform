#!/bin/bash

# Скрипт для запуска собственного Judge0 локально

echo "🚀 Запуск Judge0 сервера..."
echo ""

# Проверяем Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker: https://www.docker.com/get-started"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker не запущен. Запустите Docker Desktop."
    exit 1
fi

echo "✅ Docker готов"
echo ""

# Запускаем Judge0
echo "📦 Запуск Judge0 (Redis + PostgreSQL + Judge0)..."
docker-compose -f docker-compose.judge0.yml up -d

# Ждём запуска
echo ""
echo "⏳ Ожидание запуска сервисов (30 секунд)..."
sleep 30

# Проверяем статус
echo ""
echo "📊 Статус сервисов:"
docker-compose -f docker-compose.judge0.yml ps

# Проверяем доступность
echo ""
echo "🔍 Проверка доступности Judge0..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:2358/about)

if [ "$response" = "200" ]; then
    echo "✅ Judge0 работает на http://localhost:2358"
    echo ""
    echo "🎉 Готово! Теперь в .env.local добавьте:"
    echo "JUDGE0_URL=http://localhost:2358"
    echo ""
    echo "И измените CodeEditor чтобы использовать /api/compile-self-hosted"
else
    echo "⚠️  Judge0 ещё запускается. Подождите минуту и проверьте логи:"
    echo "docker-compose -f docker-compose.judge0.yml logs judge0-server"
fi

echo ""
echo "📝 Полезные команды:"
echo "  Остановить: docker-compose -f docker-compose.judge0.yml down"
echo "  Логи: docker-compose -f docker-compose.judge0.yml logs -f"
echo "  Перезапуск: docker-compose -f docker-compose.judge0.yml restart"
