import Link from 'next/link';
import UserProfile from '@/components/UserProfile';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <UserProfile />

      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Изучение основ языка C
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Интерактивный курс по основам синтаксиса C с автоматической проверкой кода
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <Link href="/theory" className="group">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Теория
              </h2>
              <p className="text-gray-600">
                Изучите основы синтаксиса C: условные операторы, циклы, функции и математические операции
              </p>
            </div>
          </Link>

          <Link href="/tasks" className="group">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-500">
              <div className="text-4xl mb-4">💻</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                Задачи
              </h2>
              <p className="text-gray-600">
                Решите 15 практических задач с автоматической проверкой вашего кода
              </p>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">О курсе</h2>

          <div className="space-y-4 text-gray-700">
            <p>
              Этот курс создан для изучения основ программирования на языке C.
              Вы познакомитесь с базовым синтаксисом языка и научитесь:
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Использовать условные операторы (if, switch)</li>
              <li>Работать с циклами (for, while, do-while)</li>
              <li>Создавать и использовать функции</li>
              <li>Выполнять математические операции</li>
            </ul>

            <p className="mt-6">
              Курс включает <strong>15 практических задач</strong> с автоматической проверкой.
              Каждая задача содержит несколько тестов, которые проверяют корректность вашего решения.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
              <p className="font-semibold text-blue-900 mb-2">💡 Совет для начинающих</p>
              <p className="text-blue-800">
                Если вам сложно, начните с раздела «Теория», где подробно объясняется каждая конструкция языка с примерами кода.
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Link
              href="/theory"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Начать с теории
            </Link>
            <Link
              href="/tasks"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Перейти к задачам
            </Link>
          </div>
        </div>

        <footer className="text-center mt-16 text-gray-600">
          <p>Лабораторная работа №1: Основы синтаксиса языка C</p>
        </footer>
      </div>
    </div>
  );
}
