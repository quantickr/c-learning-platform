'use client';

import Link from 'next/link';
import { theorySections } from '@/lib/theory';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function TheoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            ← Назад на главную
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Теория: Основы языка C
          </h1>
          <p className="text-gray-900">
            Изучите основные конструкции языка C с примерами и пояснениями
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Боковая навигация */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
              <h2 className="font-bold text-lg mb-4 text-gray-900">Содержание</h2>
              <nav className="space-y-2">
                {theorySections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block px-3 py-2 rounded text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t">
                <Link
                  href="/tasks"
                  className="block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
                >
                  К задачам
                </Link>
              </div>
            </div>
          </aside>

          {/* Основной контент */}
          <main className="lg:col-span-3">
            <div className="space-y-12">
              {theorySections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="bg-white rounded-lg shadow-lg p-8"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {section.title}
                  </h2>

                  <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-900 prose-li:text-gray-900">
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
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-100 text-gray-900 px-1 py-0.5 rounded text-sm" {...rest}>
                              {children}
                            </code>
                          );
                        },
                        h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-6">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">{children}</h3>,
                        p: ({ children }) => <p className="text-gray-900 mb-4 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside text-gray-900 space-y-2 mb-4">{children}</ul>,
                        li: ({ children }) => <li className="text-gray-900">{children}</li>,
                        strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                      }}
                    >
                      {section.content}
                    </ReactMarkdown>
                  </div>

                  {section.examples.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Примеры кода
                      </h3>
                      <div className="space-y-6">
                        {section.examples.map((example, index) => (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2 border-b">
                              <p className="text-sm text-gray-900 font-medium">
                                {example.description}
                              </p>
                            </div>
                            <SyntaxHighlighter
                              language="c"
                              style={vscDarkPlus as any}
                              customStyle={{ margin: 0, borderRadius: 0 }}
                            >
                              {example.code}
                            </SyntaxHighlighter>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
              <h3 className="text-xl font-bold text-blue-900 mb-2">
                Готовы применить знания на практике?
              </h3>
              <p className="text-blue-800 mb-4">
                Переходите к решению задач и проверьте своё понимание материала!
              </p>
              <Link
                href="/tasks"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Перейти к задачам
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
