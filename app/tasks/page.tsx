'use client';

import Link from 'next/link';
import { tasks } from '@/lib/tasks';
import LabFileButton from '@/components/LabFileButton';
import UserProfile from '@/components/UserProfile';

export default function TasksPage() {
  const tasksByType = tasks.reduce((acc, task) => {
    if (!acc[task.type]) {
      acc[task.type] = [];
    }
    acc[task.type].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const typeNames: Record<string, string> = {
    'if': 'Условные операторы (if)',
    'switch': 'Оператор switch',
    'for': 'Циклы for',
    'do-while': 'Циклы do-while',
    'math': 'Математические операции'
  };

  const typeColors: Record<string, string> = {
    'if': 'bg-blue-100 text-blue-800 border-blue-300',
    'switch': 'bg-purple-100 text-purple-800 border-purple-300',
    'for': 'bg-green-100 text-green-800 border-green-300',
    'do-while': 'bg-orange-100 text-orange-800 border-orange-300',
    'math': 'bg-pink-100 text-pink-800 border-pink-300'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserProfile />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            ← Назад на главную
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Практические задачи
          </h1>
          <p className="text-gray-900">
            Решите 15 задач по основам синтаксиса C с автоматической проверкой
          </p>
        </header>

        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-800">
            <strong>Важно:</strong> Каждая задача проверяется несколькими тестами, включая граничные случаи.
            Обращайте внимание на особые ситуации: ноль, отрицательные числа, большие значения.
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(tasksByType).map(([type, typeTasks]) => (
            <section key={type} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {typeNames[type] || type}
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="group"
                  >
                    <div className="border-2 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all h-full flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl font-bold text-gray-300 group-hover:text-blue-500 transition-colors">
                          #{task.id}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${typeColors[task.type]}`}>
                          {task.type}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </h3>

                      <p className="text-sm text-gray-900 mb-3 flex-grow">
                        {task.description}
                      </p>

                      <div className="text-xs text-gray-900">
                        {task.tests.length} тестов
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12">
          <LabFileButton />
        </div>

        <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            Нужна помощь?
          </h3>
          <p className="text-blue-800 mb-4">
            Если вы застряли на задаче, вернитесь к разделу с теорией и изучите соответствующую тему.
          </p>
          <Link
            href="/theory"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Вернуться к теории
          </Link>
        </div>
      </div>
    </div>
  );
}
