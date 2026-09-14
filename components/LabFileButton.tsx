'use client';

import { useState } from 'react';
import { buildLabFile, LAB1_FILENAME, type LabBuild } from '@/lib/labFile';

// Сборка lab1.c из кода, который ученик уже написал в задачах. Читаем
// localStorage, поэтому всё происходит по клику на клиенте, а не при рендере.
export default function LabFileButton() {
  const [build, setBuild] = useState<LabBuild | null>(null);

  const assemble = () => setBuild(buildLabFile());

  const download = () => {
    if (!build) return;
    const blob = new Blob([build.file], { type: 'text/x-c;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = LAB1_FILENAME;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        📄 Собрать {LAB1_FILENAME} из своих решений
      </h2>
      <p className="text-gray-900 text-sm mb-4">
        Все 15 задач одним файлом в том виде, в каком их сдаёт лабораторная.
        Тела функций берутся из того, что вы написали в редакторе и что сохранилось
        в этом браузере; где решения нет — остаётся{' '}
        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">TODO</code>.
      </p>
      <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <p className="text-yellow-800 text-sm">
          <strong>Сигнатуры здесь из задания лабораторной, а не из шаблонов платформы.</strong>{' '}
          Шесть функций называются иначе, у задач 10 и 13 другие имена параметров, а задачи 6, 12
          и 13 должны возвращать <code className="font-mono">const char*</code> вместо того, чтобы
          печатать строку. Всё это переносится автоматически — имена функций, имена параметров и{' '}
          <code className="font-mono">{'printf("зима\\n")'}</code> →{' '}
          <code className="font-mono">{'return "зима"'}</code>, — но результат нужно прочитать
          глазами до сдачи. Что автоматика не смогла перевести однозначно, перечисляется ниже
          после сборки.
        </p>
      </div>

      <button
        onClick={assemble}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        🔧 Собрать файл
      </button>

      {build && (
        <div className="mt-5">
          <div className="text-sm text-gray-900 mb-3">
            Перенесено решений: <strong>{build.carried}</strong> из {build.total} функций,
            заглушками осталось: <strong>{build.todo}</strong>
            {build.helpers > 0 && (
              <>, вспомогательных функций подхвачено: <strong>{build.helpers}</strong></>
            )}.
          </div>

          {build.notes.length > 0 && (
            <div className="mb-4 p-3 rounded border-2 border-amber-400 bg-amber-50">
              <div className="font-semibold text-amber-900 mb-1 text-sm">
                ⚠ Проверьте перед сдачей
              </div>
              <ul className="text-sm text-amber-900 space-y-1 list-disc list-inside">
                {build.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-4">
            <div className="font-semibold text-gray-900 mb-2 text-sm">Что получилось:</div>
            <pre className="p-3 rounded border bg-gray-900 text-gray-100 text-xs overflow-auto max-h-96 font-mono whitespace-pre">
              {build.file}
            </pre>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={download}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              ⬇ Скачать {LAB1_FILENAME}
            </button>
            <button
              onClick={assemble}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔄 Пересобрать
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
