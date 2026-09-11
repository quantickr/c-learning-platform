'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface UserProgress {
  userId: string;
  progress: {
    completedTasks: number[];
    lastAccess: string;
    statistics: {
      totalTests: number;
      passedTests: number;
      failedTests: number;
      tasksAttempted: number;
    };
  };
}

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/progress');
      if (response.data.success) {
        setProgress(response.data);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && !progress) {
      loadProgress();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
        title="Профиль"
      >
        <span className="text-xl">👤</span>
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-40">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👤</span>
          <h3 className="font-bold">Мой профиль</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 rounded px-2 py-1 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="p-4">
        {loading && (
          <div className="text-center text-gray-900">Загрузка...</div>
        )}

        {!loading && progress && (
          <div className="space-y-4">
            {/* ID пользователя */}
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-xs text-gray-900 mb-1">ID пользователя</div>
              <div className="text-xs font-mono text-gray-900 break-all">
                {progress.userId.slice(0, 8)}...
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {progress.progress.completedTasks.length}
                </div>
                <div className="text-xs text-green-600">Решено задач</div>
              </div>

              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">
                  {progress.progress.statistics.tasksAttempted}
                </div>
                <div className="text-xs text-blue-600">Попыток</div>
              </div>

              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">
                  {progress.progress.statistics.passedTests}
                </div>
                <div className="text-xs text-purple-600">Тестов пройдено</div>
              </div>

              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                <div className="text-2xl font-bold text-orange-700">
                  {Math.round(
                    (progress.progress.statistics.passedTests /
                      Math.max(progress.progress.statistics.totalTests, 1)) *
                      100
                  )}%
                </div>
                <div className="text-xs text-orange-600">Успешность</div>
              </div>
            </div>

            {/* Решённые задачи */}
            <div>
              <div className="text-sm font-bold text-gray-900 mb-2">
                Решённые задачи:
              </div>
              {progress.progress.completedTasks.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {progress.progress.completedTasks.sort((a, b) => a - b).map(taskId => (
                    <span
                      key={taskId}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold"
                    >
                      #{taskId}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-900">
                  Пока ни одной задачи не решено
                </div>
              )}
            </div>

            {/* Последний визит */}
            <div className="text-xs text-gray-900 pt-2 border-t">
              Последний визит: {new Date(progress.progress.lastAccess).toLocaleString('ru-RU')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
