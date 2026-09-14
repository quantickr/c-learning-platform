'use client';

import { LAB1_FILE, LAB1_FILENAME } from '@/lib/labFile';

// Скачивание собранного файла lab1.c. Делаем на клиенте через Blob —
// запрос на сервер не нужен, файл целиком лежит в бандле.
export default function LabFileButton() {
  const download = () => {
    const blob = new Blob([LAB1_FILE], { type: 'text/x-c;charset=utf-8' });
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
        📄 Собрать файл со всеми задачами
      </h2>
      <p className="text-gray-900 text-sm mb-4">
        Скачивает <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{LAB1_FILENAME}</code>{' '}
        — все 15 задач одним файлом, с заглушками <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">TODO</code>{' '}
        вместо тел функций. Удобно дописывать в своей IDE и сдавать лабораторную целиком.
      </p>
      <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <p className="text-yellow-800 text-sm">
          <strong>Обратите внимание:</strong> сигнатуры в файле соответствуют заданию
          лабораторной, а не шаблонам платформы. Восемь функций называются иначе,
          а задачи 6, 12 и 13 должны возвращать <code className="font-mono">const char*</code>{' '}
          вместо того, чтобы печатать строку. Перенести решение из редактора копипастом
          не получится — его нужно переписать под эти сигнатуры.
        </p>
      </div>
      <button
        onClick={download}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        ⬇ Скачать {LAB1_FILENAME}
      </button>
    </div>
  );
}
