'use client';

import { Editor } from '@monaco-editor/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  clearSavedCode,
  isDeadLegacyCode,
  readSavedCode,
  readSavedTemplate,
  writeSavedCode,
} from '@/lib/savedCode';

interface CodeEditorProps {
  initialCode: string;
  taskId?: number;
  mainFunction?: string; // main() для тестирования (скрыта от пользователя)
  tests: {
    input: string;
    expectedOutput: string;
    description?: string;
  }[];
  onSuccess?: () => void;
}

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
  description?: string;
}

// Предупреждения gcc. Код собрался и может даже проходить тесты, но это
// ровно то, что ученик должен увидеть: забытый return, printf("%d", double),
// присвоенная и не использованная переменная. Отдельный цвет — не ошибка
// и не успех.
function WarningBox({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="mt-3 p-3 rounded border-2 border-amber-400 bg-amber-50">
      <div className="font-semibold text-amber-900 mb-1 text-sm">
        ⚠ Компилятор предупреждает
      </div>
      <pre className="text-xs text-amber-900 whitespace-pre-wrap break-all font-mono">
        {text}
      </pre>
    </div>
  );
}

// Сервер отвечает внятной причиной в теле (в том числе 429 от rate limit в
// middleware.ts), но axios бросает исключение на любом статусе вне 2xx.
// Без разборки ученик видит «Ошибка подключения к серверу» даже тогда,
// когда сервер жив и просто попросил подождать минуту.
function describeRequestError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: unknown } | undefined;
    const message = typeof data?.error === 'string' ? data.error.trim() : '';
    if (message) return `Ошибка:\n${message}`;
    if (error.response) return `Ошибка:\nСервер ответил ${error.response.status}`;
    if (error.code === 'ECONNABORTED') return 'Ошибка:\nСервер не ответил вовремя';
  }
  return 'Ошибка подключения к серверу';
}

export default function CodeEditor({ initialCode, taskId, mainFunction, tests, onSuccess }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState('');
  const [customWarning, setCustomWarning] = useState('');
  const [testWarning, setTestWarning] = useState('');
  const [showCustomRun, setShowCustomRun] = useState(false);
  const [isCustomRunning, setIsCustomRunning] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');

  // Загрузка сохранённого кода при монтировании.
  // Шаблон сохранён рядом с кодом, чтобы отличать «ученик ничего не менял»
  // от «ученик написал решение»: первое можно выбросить при смене шаблона,
  // второе — никогда.
  useEffect(() => {
    if (!taskId) return;
    const saved = readSavedCode(taskId);
    if (!saved) return;
    const savedTpl = readSavedTemplate(taskId);

    if (savedTpl === null) {
      // старый кэш без отметки шаблона
      if (isDeadLegacyCode(saved)) {
        clearSavedCode(taskId);
        return;
      }
    } else if (saved === savedTpl) {
      // шаблон не правили, а сам он мог устареть — берём текущий
      clearSavedCode(taskId);
      return;
    }

    setCode(saved);
    setSaveStatus('saved');
  }, [taskId]);

  // Автосохранение при изменении кода
  useEffect(() => {
    if (taskId && code !== initialCode) {
      setSaveStatus('unsaved');
      const timer = setTimeout(() => {
        writeSavedCode(taskId, code, initialCode);
        setSaveStatus('saved');
      }, 1000); // Сохранение через 1 секунду после последнего изменения

      return () => clearTimeout(timer);
    }
  }, [code, taskId, initialCode]);

  const resetCode = () => {
    if (confirm('Вы уверены, что хотите сбросить код к начальному шаблону? Все изменения будут потеряны.')) {
      setCode(initialCode);
      if (taskId) clearSavedCode(taskId);
      setSaveStatus('saved');
    }
  };

  const compareOutputs = (expected: string, actual: string): boolean => {
    const normalize = (str: string) => str.trim().replace(/\r\n/g, '\n');
    const exp = normalize(expected);
    const act = normalize(actual);

    // Проверка для чисел с плавающей точкой
    const floatRegex = /^-?\d+\.\d+$/;
    if (floatRegex.test(exp) && floatRegex.test(act)) {
      const expFloat = parseFloat(exp);
      const actFloat = parseFloat(act);
      return Math.abs(expFloat - actFloat) < 1e-6;
    }

    return exp === act;
  };

  const runCustomCode = async () => {
    setIsCustomRunning(true);
    setCustomOutput('');
    setCustomWarning('');

    try {
      // Добавляем main() к коду пользователя
      const fullCode = mainFunction ? code + '\n' + mainFunction : code;

      const response = await axios.post('/api/compile-self-hosted', {
        code: fullCode,
        input: customInput
      });

      if (response.data.success) {
        setCustomOutput(response.data.output || '(пусто)');
        setCustomWarning(response.data.warnings || '');
      } else {
        setCustomOutput(`Ошибка:\n${response.data.error}`);
      }
    } catch (error) {
      setCustomOutput(describeRequestError(error));
    }

    setIsCustomRunning(false);
  };

  const runTests = async () => {
    setIsRunning(true);
    setShowResults(true);
    setTestResults([]);
    setTestWarning('');

    const results: TestResult[] = [];
    // gcc компилирует один и тот же код на каждый тест, поэтому
    // предупреждения одинаковые — показываем их один раз, не в каждой карточке
    let warning = '';

    for (const test of tests) {
      try {
        // Добавляем main() к коду пользователя
        const fullCode = mainFunction ? code + '\n' + mainFunction : code;

        const response = await axios.post('/api/compile-self-hosted', {
          code: fullCode,
          input: test.input
        });

        if (response.data.success) {
          if (!warning && response.data.warnings) warning = response.data.warnings;
          const passed = compareOutputs(test.expectedOutput, response.data.output);
          results.push({
            passed,
            input: test.input,
            expectedOutput: test.expectedOutput,
            actualOutput: response.data.output,
            description: test.description
          });
        } else {
          results.push({
            passed: false,
            input: test.input,
            expectedOutput: test.expectedOutput,
            actualOutput: '',
            error: response.data.error,
            description: test.description
          });
        }
      } catch (error) {
        results.push({
          passed: false,
          input: test.input,
          expectedOutput: test.expectedOutput,
          actualOutput: '',
          error: describeRequestError(error),
          description: test.description
        });
        // 429 от rate limit: остальные запросы упрутся в тот же лимит,
        // добивать сервер бессмысленно — прерываемся и показываем причину
        if (axios.isAxiosError(error) && error.response?.status === 429) break;
      }
    }

    setTestResults(results);
    setTestWarning(warning);
    setIsRunning(false);

    // Проверяем, все ли тесты прошли. Прогон мог прерваться на 429, поэтому
    // «пройдено» требует ещё и полного количества результатов.
    const allPassed = results.length === tests.length && results.every(r => r.passed);
    const passedTests = results.filter(r => r.passed).length;

    // Сохраняем прогресс
    try {
      await axios.post('/api/progress', {
        taskId,
        passed: allPassed,
        testsTotal: tests.length,
        testsPassed: passedTests
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }

    if (allPassed && onSuccess) {
      onSuccess();
    }
  };

  const passedCount = testResults.filter(r => r.passed).length;
  const totalCount = testResults.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded-lg overflow-hidden">
        <Editor
          height="500px"
          defaultLanguage="c"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={() => setShowCustomRun(!showCustomRun)}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {showCustomRun ? 'Скрыть отладку' : 'Запустить код'}
        </button>

        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? 'Проверка...' : 'Запустить тесты'}
        </button>

        <button
          onClick={resetCode}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          title="Сбросить код к начальному шаблону"
        >
          🔄 Сбросить
        </button>

        <div className="flex items-center gap-2">
          {saveStatus === 'saved' && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              ✓ Сохранено
            </span>
          )}
          {saveStatus === 'unsaved' && (
            <span className="text-sm text-orange-600 flex items-center gap-1">
              ○ Не сохранено
            </span>
          )}
          {saveStatus === 'saving' && (
            <span className="text-sm text-blue-600 flex items-center gap-1">
              ⟳ Сохранение...
            </span>
          )}
        </div>

        {showResults && (
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${passedCount === totalCount ? 'text-green-600' : 'text-orange-600'}`}>
              Пройдено тестов: {passedCount} / {totalCount}
            </span>
          </div>
        )}
      </div>

      {showCustomRun && (
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Отладка кода</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Входные данные:
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Введите входные данные..."
                className="w-full h-32 p-3 border rounded font-mono text-sm text-gray-900 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Результат выполнения:
              </label>
              <div className="w-full h-32 p-3 border rounded bg-white font-mono text-sm text-gray-900 overflow-auto whitespace-pre-wrap">
                {customOutput ? (
                  customOutput.includes('Ошибка') ? (
                    <span className="text-red-600">{customOutput}</span>
                  ) : (
                    customOutput
                  )
                ) : (
                  '(запустите код, чтобы увидеть результат)'
                )}
              </div>
            </div>
          </div>

          <WarningBox text={customWarning} />

          <button
            onClick={runCustomCode}
            disabled={isCustomRunning}
            className="mt-3 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isCustomRunning ? 'Выполнение...' : '▶ Выполнить'}
          </button>
        </div>
      )}

      {showResults && testResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Результаты тестов:</h3>
          <WarningBox text={testWarning} />
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.passed
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">Тест {index + 1}</span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      result.passed
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {result.passed ? '✓ Пройден' : '✗ Не пройден'}
                  </span>
                </div>

                {result.description && (
                  <div className="mb-2 text-sm text-gray-900">
                    {result.description}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Входные данные:</div>
                    <div className="bg-white p-2 rounded border font-mono whitespace-pre-wrap break-all text-gray-900">
                      {result.input || '(пусто)'}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Ожидаемый вывод:</div>
                    <div className="bg-white p-2 rounded border font-mono whitespace-pre-wrap break-all text-gray-900">
                      {result.expectedOutput}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Ваш вывод:</div>
                    <div className="bg-white p-2 rounded border font-mono whitespace-pre-wrap break-all text-gray-900">
                      {result.error ? (
                        <span className="text-red-600">{result.error}</span>
                      ) : (
                        result.actualOutput || '(пусто)'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
