'use client';

import { use } from 'react';
import Link from 'next/link';
import { tasks } from '@/lib/tasks';
import CodeEditor from '@/components/CodeEditor';
import ChatAssistant from '@/components/ChatAssistant';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const taskId = parseInt(id);
  const task = tasks.find(t => t.id === taskId);
  const [showHints, setShowHints] = useState(false);
  const [showTheory, setShowTheory] = useState(false);

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Задача не найдена</h1>
          <Link href="/tasks" className="text-blue-600 hover:text-blue-800">
            Вернуться к списку задач
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = tasks.findIndex(t => t.id === taskId);
  const prevTask = currentIndex > 0 ? tasks[currentIndex - 1] : null;
  const nextTask = currentIndex < tasks.length - 1 ? tasks[currentIndex + 1] : null;

  const typeColors: Record<string, string> = {
    'if': 'bg-blue-100 text-blue-800 border-blue-300',
    'switch': 'bg-purple-100 text-purple-800 border-purple-300',
    'for': 'bg-green-100 text-green-800 border-green-300',
    'do-while': 'bg-orange-100 text-orange-800 border-orange-300',
    'math': 'bg-pink-100 text-pink-800 border-pink-300'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/tasks" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            ← Все задачи
          </Link>
          <div className="flex gap-2">
            {prevTask && (
              <Link
                href={`/tasks/${prevTask.id}`}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                ← Предыдущая
              </Link>
            )}
            {nextTask && (
              <Link
                href={`/tasks/${nextTask.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Следующая →
              </Link>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Описание задачи */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-300">#{task.id}</span>
                <span className={`px-3 py-1 rounded text-sm font-semibold border ${typeColors[task.type]}`}>
                  {task.type}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {task.title}
              </h1>

              <p className="text-gray-700 mb-6">
                {task.description}
              </p>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Примеры:</h3>
                <div className="space-y-3">
                  {task.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded border">
                      <div className="text-sm mb-1">
                        <span className="font-semibold text-gray-700">Вход:</span>
                        <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                          {example.input}
                        </code>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Выход:</span>
                        <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                          {example.output}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {task.hints && task.hints.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="w-full px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors font-semibold"
                  >
                    {showHints ? '🔒 Скрыть подсказки' : '💡 Показать подсказки'}
                  </button>

                  {showHints && (
                    <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded">
                      <ul className="space-y-2 text-sm text-gray-700">
                        {task.hints.map((hint, index) => (
                          <li key={index} className="flex gap-2">
                            <span>•</span>
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {task.relatedTheory && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowTheory(!showTheory)}
                    className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors font-semibold"
                  >
                    {showTheory ? '📕 Скрыть теорию' : '📖 Показать теорию'}
                  </button>

                  {showTheory && (
                    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded max-h-96 overflow-y-auto">
                      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-900 prose-li:text-gray-900">
                        <ReactMarkdown
                          components={{
                            code(props) {
                              const { children, className, ...rest } = props;
                              const match = /language-(\w+)/.exec(className || '');
                              return match ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus as any}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{ fontSize: '0.75rem' }}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className="bg-gray-100 text-gray-900 px-1 py-0.5 rounded text-xs" {...rest}>
                                  {children}
                                </code>
                              );
                            },
                            h2: ({ children }) => <h2 className="text-lg font-bold text-gray-900 mb-2 mt-3">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base font-bold text-gray-900 mb-2 mt-2">{children}</h3>,
                            p: ({ children }) => <p className="text-gray-900 mb-2 text-sm leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside text-gray-900 space-y-1 mb-2 text-sm">{children}</ul>,
                            li: ({ children }) => <li className="text-gray-900 text-sm">{children}</li>,
                            strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                          }}
                        >
                          {task.relatedTheory}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-sm text-gray-600">
                <strong>Количество тестов:</strong> {task.tests.length}
              </div>
            </div>
          </div>

          {/* Редактор кода */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Ваше решение
              </h2>

              <CodeEditor
                initialCode={task.template}
                taskId={task.id}
                mainFunction={task.mainFunction}
                tests={task.tests}
              />

              <div className="mt-6 bg-gray-50 p-4 rounded border">
                <h3 className="font-bold text-gray-900 mb-2">💡 Советы:</h3>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Напишите код внутри предоставленной функции</li>
                  <li>Функция main() добавляется автоматически при проверке</li>
                  <li>После написания кода нажмите «Запустить тесты»</li>
                  <li>Обратите внимание на граничные случаи (ноль, отрицательные числа, большие значения)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Помощник */}
      <ChatAssistant
        taskContext={`Задача: ${task.title}\nОписание: ${task.description}\nТип: ${task.type}`}
      />
    </div>
  );
}
