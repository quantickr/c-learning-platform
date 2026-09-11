'use client';

import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import axios from 'axios';

interface CodeEditorProps {
  initialCode: string;
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

export default function CodeEditor({ initialCode, tests, onSuccess }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);

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

  const runTests = async () => {
    setIsRunning(true);
    setShowResults(true);
    setTestResults([]);

    const results: TestResult[] = [];

    for (const test of tests) {
      try {
        const response = await axios.post('/api/compile', {
          code,
          input: test.input
        });

        if (response.data.success) {
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
          error: 'Ошибка подключения к серверу',
          description: test.description
        });
      }
    }

    setTestResults(results);
    setIsRunning(false);

    // Проверяем, все ли тесты прошли
    const allPassed = results.every(r => r.passed);
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

      <div className="flex gap-2">
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? 'Проверка...' : 'Запустить тесты'}
        </button>

        {showResults && (
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${passedCount === totalCount ? 'text-green-600' : 'text-orange-600'}`}>
              Пройдено тестов: {passedCount} / {totalCount}
            </span>
          </div>
        )}
      </div>

      {showResults && testResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Результаты тестов:</h3>
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
                  <span className="font-semibold">Тест {index + 1}</span>
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
                  <div className="mb-2 text-sm text-gray-600">
                    {result.description}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-gray-700 mb-1">Входные данные:</div>
                    <div className="bg-white p-2 rounded border font-mono whitespace-pre-wrap break-all">
                      {result.input || '(пусто)'}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-700 mb-1">Ожидаемый вывод:</div>
                    <div className="bg-white p-2 rounded border font-mono whitespace-pre-wrap break-all">
                      {result.expectedOutput}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-700 mb-1">Ваш вывод:</div>
                    <div className="bg-white p-2 rounded border font-mono whitespace-pre-wrap break-all">
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
