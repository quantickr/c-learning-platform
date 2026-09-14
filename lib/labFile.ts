// Сборка lab1.c: все 15 задач одним файлом, с телами функций, которые
// ученик уже написал в редакторе (они лежат в localStorage), и с TODO там,
// где решения нет.
//
// ВАЖНО: сигнатуры здесь — из задания лабораторной, а не из шаблонов
// платформы. Расходятся восемь из пятнадцати, шестью именами функций:
//
//   задача  platform (lib/tasks.ts)         lab1.c
//   3       sign                            sign_of_number
//   4       absolute                        absolute_value
//   5       is_triangle                     triangle_exists
//   6       void grade_class + printf       const char* get_grade
//   9       average_primes                  average_primes_in_interval
//   10      count_multiples(a, b, k)        count_multiples(start, end, k)
//   12      void season + printf            const char* season_by_month
//   13      void day_of_week(day) + printf  const char* day_of_week(day_num)
//
// Тело переносится под новую сигнатуру, и переносится не голым копипастом:
//   - printf("…") / puts("…") превращаются в return "…" у задач 6, 12, 13;
//   - параметры переименовываются по позициям, если имена разошлись
//     (задача 10: a→start, b→end; задача 13: day→day_num). Карта строится
//     сама из обеих сигнатур, поэтому будущие расхождения подхватятся без правок.
// Всё, что автоматике не под силу, попадает в notes и показывается до скачивания.

import { tasks } from './tasks';
import { readSavedCode } from './savedCode';

export const LAB1_FILENAME = 'lab1.c';

const TODO_BODY = '    // TODO: реализовать';

interface Slot {
  taskId?: number;        // нет у вспомогательного is_prime — его задача не учит
  comment: string;
  signature: string;
  returnsString?: boolean; // лабораторная ждёт const char*, платформа печатала
  mismatch?: string;       // чем сигнатура отличается по сути, а не только именем
}

const SLOTS: Slot[] = [
  { taskId: 1, comment: '// Задача 1 - Чётное или нечётное', signature: 'int is_even(int n)' },
  { taskId: 2, comment: '// Задача 2 - Максимум из трёх чисел', signature: 'int max_of_three(int a, int b, int c)' },
  { taskId: 3, comment: '// Задача 3 - Знак числа', signature: 'int sign_of_number(int n)' },
  { taskId: 4, comment: '// Задача 4 - Абсолютное значение', signature: 'int absolute_value(int n)' },
  { taskId: 5, comment: '// Задача 5 - Треугольник существует', signature: 'int triangle_exists(int a, int b, int c)' },
  {
    taskId: 6,
    comment: '// Задача 6 - Класс оценок',
    signature: 'const char* get_grade(int score)',
    returnsString: true,
    mismatch: 'нужно вернуть строку, а не напечатать её',
  },
  { taskId: 7, comment: '// Задача 7 - Евклидово расстояние', signature: 'double euclidean_distance(double x1, double y1, double x2, double y2)' },
  { taskId: 8, comment: '// Задача 8 - Манхэттенское расстояние', signature: 'int manhattan_distance(int x1, int y1, int x2, int y2)' },
  {
    comment: '// Вспомогательная функция для проверки простоты (можно писать сразу в задаче 9, но это плохой тон)',
    signature: 'int is_prime(int n)',
  },
  { taskId: 9, comment: '// Задача 9 - Среднее арифметическое простых чисел в интервале', signature: 'double average_primes_in_interval(int a, int b)' },
  {
    taskId: 10,
    comment: '// Задача 10 - Кратные числа в интервале',
    signature: 'int count_multiples(int start, int end, int k)',
    mismatch: 'параметры называются start и end, а не a и b',
  },
  { taskId: 11, comment: '// Задача 11 - Високосный год', signature: 'int is_leap_year(int year)' },
  {
    taskId: 12,
    comment: '// Задача 12 - Сезон по номеру месяца',
    signature: 'const char* season_by_month(int month)',
    returnsString: true,
    mismatch: 'нужно вернуть строку, а не напечатать её',
  },
  {
    taskId: 13,
    comment: '// Задача 13 - День недели',
    signature: 'const char* day_of_week(int day_num)',
    returnsString: true,
    mismatch: 'нужно вернуть строку, а не напечатать её; параметр называется day_num, а не day',
  },
  { taskId: 14, comment: '// Задача 14 - Подсчёт цифр в числе', signature: 'int count_digits(int n)' },
  { taskId: 15, comment: '// Задача 15 - Реверс числа', signature: 'int reverse_number(int n)' },
];

// Имя функции из сигнатуры: последний идентификатор перед открывающей скобкой
function funcName(signature: string): string | null {
  const m = /([A-Za-z_]\w*)\s*\(/.exec(signature.replace(/#include[^\n]*\n/g, ''));
  return m ? m[1] : null;
}

// Имена параметров по позициям: «const char* f(int day_num)» → ['day_num']
function paramNames(signature: string): string[] {
  const open = signature.indexOf('(');
  const close = signature.lastIndexOf(')');
  if (open < 0 || close <= open) return [];
  return signature
    .slice(open + 1, close)
    .split(',')
    .map((part) => {
      const m = /([A-Za-z_]\w*)\s*$/.exec(part.trim());
      return m ? m[1] : '';
    });
}

// Карта переименований параметров: сравниваем сигнатуры по позициям
function paramRenameMap(platformSig: string, labSig: string): Map<string, string> {
  const from = paramNames(platformSig);
  const to = paramNames(labSig);
  const map = new Map<string, string>();
  for (let i = 0; i < Math.min(from.length, to.length); i++) {
    if (from[i] && to[i] && from[i] !== to[i]) map.set(from[i], to[i]);
  }
  return map;
}

// Один проход, чтобы переименования не накладывались друг на друга
// (a→b и b→a за два прохода схлопнулись бы в одно)
function renameParams(body: string, map: Map<string, string>): string {
  if (map.size === 0) return body;
  const re = new RegExp(`\\b(${[...map.keys()].join('|')})\\b`, 'g');
  return body.replace(re, (m) => map.get(m) ?? m);
}

// Поиск парной фигурной скобки. Строки, символьные литералы и комментарии
// пропускаем — иначе «{» внутри printf или в комментарии собьёт счёт.
function matchBrace(src: string, open: number): number {
  let depth = 0;
  let i = open;
  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];
    if (c === '/' && next === '/') {
      const eol = src.indexOf('\n', i);
      if (eol < 0) return -1;
      i = eol;
      continue;
    }
    if (c === '/' && next === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end < 0 ? src.length : end + 2;
      continue;
    }
    if (c === '"' || c === "'") {
      i++;
      while (i < src.length && src[i] !== c) {
        if (src[i] === '\\') i++;
        i++;
      }
      i++;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return -1;
}

// Тело функции ученика: ищем имя из шаблона платформы, от него первую «{»
// и берём всё до парной «}».
function extractBody(code: string, name: string): string | null {
  const m = new RegExp(`\\b${name}\\s*\\(`).exec(code);
  if (!m) return null;
  const open = code.indexOf('{', m.index + m[0].length);
  if (open < 0) return null;
  const close = matchBrace(code, open);
  if (close < 0) return null;
  return code.slice(open + 1, close);
}

// Убрать мусор шаблона и привести отступы к четырём пробелам
function cleanBody(raw: string): string | null {
  const kept = raw
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      if (/^exit\(0\)\s*;/.test(t)) return false;      // заглушка платформы
      if (/^\/\/\s*Ваш код здесь/.test(t)) return false;
      if (/^\/\/\s*Используйте do-while!/.test(t)) return false;
      return true;
    })
    .map((line) => line.replace(/\s+$/, ''));

  while (kept.length && !kept[0].trim()) kept.shift();
  while (kept.length && !kept[kept.length - 1].trim()) kept.pop();
  if (!kept.length) return null;

  // Если ученик писал от нулевого столбца — сдвинуть тело целиком
  const first = kept.find((l) => l.trim());
  if (first && /^\S/.test(first)) {
    return kept.map((l) => (l.trim() ? `    ${l}` : l)).join('\n');
  }
  return kept.join('\n');
}

// printf("зима\n"); → return "зима"; — работает только на литералах без
// форматирования, всё остальное оставляем как есть и сообщаем.
function printfToReturn(body: string): { body: string; left: number } {
  const out = body
    .replace(/printf\(\s*"([^"%]*?)(?:\\n)?"\s*\)\s*;/g, 'return "$1";')
    .replace(/puts\(\s*"([^"%]*?)"\s*\)\s*;/g, 'return "$1";');
  const left = (out.match(/\b(?:printf|puts)\s*\(/g) || []).length;
  return { body: out, left };
}

const STDLIB_CALLS = /\b(?:abs|labs|atoi|atof|strtol|malloc|calloc|realloc|free|exit)\s*\(/;

export interface LabBuild {
  file: string;
  notes: string[];
  carried: number;   // сколько задач перенесено с кодом ученика
  todo: number;      // сколько осталось заглушками
  total: number;     // сколько всего функций в файле
  renamed: number;   // у скольких функций отличается имя
}

export function buildLabFile(): LabBuild {
  const notes: string[] = [];
  const blocks: string[] = [];
  let carried = 0;
  let renamed = 0;
  let needsStdlib = false;

  for (const slot of SLOTS) {
    let body: string | null = null;

    if (slot.taskId !== undefined) {
      const task = tasks.find((t) => t.id === slot.taskId);
      const saved = task ? readSavedCode(task.id) : null;

      // сигнатура платформы — из её шаблона, она же даёт имя и параметры
      const platformSig = (() => {
        if (!task) return null;
        const open = task.template.indexOf('{');
        return open < 0 ? null : task.template.slice(0, open).replace(/#include[^\n]*/g, '').trim();
      })();

      const platformName = platformSig ? funcName(platformSig) : null;
      const labName = funcName(slot.signature);
      if (platformName && labName && platformName !== labName) renamed++;

      const raw = saved && platformName ? extractBody(saved, platformName) : null;
      body = raw ? cleanBody(raw) : null;

      if (body) {
        carried++;
        if (STDLIB_CALLS.test(body)) needsStdlib = true;

        if (platformSig) {
          const map = paramRenameMap(platformSig, slot.signature);
          if (map.size > 0) {
            body = renameParams(body, map);
            notes.push(
              `Задача ${slot.taskId}: параметры переименованы ${[...map].map(([f, t]) => `${f}→${t}`).join(', ')} по всему телу. Если у вас были свои переменные с такими именами — проверьте.`
            );
          }
        }

        if (slot.returnsString) {
          const fixed = printfToReturn(body);
          body = fixed.body;
          if (fixed.left > 0) {
            notes.push(
              `Задача ${slot.taskId}: ${fixed.left} вызов(а) printf/puts не удалось заменить автоматически — ${slot.mismatch}. Допишите return вручную.`
            );
          } else if (!/\breturn\b/.test(body)) {
            notes.push(`Задача ${slot.taskId}: в теле нет return — ${slot.mismatch}. Без него файл не соберётся.`);
          } else if (slot.mismatch) {
            notes.push(`Задача ${slot.taskId}: printf заменён на return автоматически — проверьте, что ${slot.mismatch}.`);
          }
        }
      }
    }

    blocks.push(`${slot.comment}\n${slot.signature} {\n${body ?? TODO_BODY}\n}`);
  }

  const includes = ['#include "lab1.h"', '#include <math.h>', '#include <stdio.h>'];
  if (needsStdlib) {
    includes.push('#include <stdlib.h>');
    notes.push('Добавлен #include <stdlib.h> — в перенесённом коде есть abs/atoi/exit или подобное.');
  }

  if (renamed > 0) {
    notes.push(
      `У ${renamed} функций имя отличается от платформенного — тела перенесены под новые имена, из своего кода их нужно вызывать по-новому.`
    );
  }
  if (carried === 0) {
    notes.push('Ни одного сохранённого решения не найдено: файл собран целиком из заглушек TODO.');
  }

  return {
    file: `${includes.join('\n')}\n\n${blocks.join('\n\n')}\n`,
    notes,
    carried,
    todo: SLOTS.length - carried,
    total: SLOTS.length,
    renamed,
  };
}
