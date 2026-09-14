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
//
// Отдельно: редактор не запрещает писать в файле задачи другие функции, и
// ученики этим пользуются — например, заводят свой is_prime и зовут его из
// задачи 9. Такие вспомогательные функции собираются со всех задач: те, для
// которых в lab1.c есть своё место (is_prime), встают туда, остальные
// выносятся наверх после include, иначе вызов шёл бы до объявления.
//
// Всё, что автоматике не под силу, попадает в notes и показывается до скачивания.

import { tasks } from './tasks';
import { readSavedCode } from './savedCode';

export const LAB1_FILENAME = 'lab1.c';

const TODO_BODY = '    // TODO: реализовать';

// Ключевые слова, которые выглядят как «имя(аргументы) {», и main —
// их определениями функций считать нельзя
const NOT_FUNCTIONS = new Set(['if', 'for', 'while', 'switch', 'return', 'do', 'else', 'sizeof', 'main']);

// Что точно не требует объявления в lab1.c
const LIBC_NAMES = new Set([
  'printf', 'fprintf', 'sprintf', 'snprintf', 'scanf', 'fscanf', 'sscanf',
  'puts', 'putchar', 'getchar', 'fgets', 'fflush',
  'sqrt', 'pow', 'fabs', 'floor', 'ceil', 'round', 'exp', 'log', 'log10',
  'abs', 'labs', 'div', 'atoi', 'atof', 'atol', 'strtol', 'strtod',
  'malloc', 'calloc', 'realloc', 'free', 'exit', 'abort',
  'strlen', 'strcpy', 'strncpy', 'strcmp', 'strncmp', 'strcat', 'strchr', 'strstr',
  'memcpy', 'memmove', 'memset', 'memcmp',
  'isdigit', 'isalpha', 'isspace', 'isupper', 'islower', 'toupper', 'tolower',
  'fopen', 'fclose', 'fread', 'fwrite', 'fseek', 'ftell',
  'time', 'clock', 'rand', 'srand',
]);

interface Slot {
  taskId?: number;         // нет у вспомогательного is_prime — его задача не учит
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
  const m = /([A-Za-z_]\w*)\s*\(/.exec(signature.replace(/#include[^\n]*/g, ''));
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

interface ParsedFunction {
  name: string;
  signature: string;  // текст от начала строки до «{»
  body: string;
}

// Все функции верхнего уровня в файле. Идём слева направо и после каждой
// принятой функции переставляем курсор за её закрывающую скобку — так
// содержимое тела не может породить вторую «функцию».
function parseFunctions(code: string): ParsedFunction[] {
  const out: ParsedFunction[] = [];
  const re = /\b([A-Za-z_]\w*)\s*\(([^;{()]*)\)\s*\{/g;
  let cursor = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    if (m.index < cursor) continue;
    const open = m.index + m[0].length - 1;
    const close = matchBrace(code, open);
    if (close < 0) continue;
    const name = m[1];
    cursor = close + 1;
    if (NOT_FUNCTIONS.has(name)) continue;

    const lineStart = code.lastIndexOf('\n', m.index) + 1;
    const signature = code.slice(lineStart, open + 1).trim();
    if (signature.startsWith('#')) continue;  // не сигнатура, а директива
    out.push({ name, signature: signature.slice(0, -1).trim(), body: code.slice(open + 1, close) });
  }
  return out;
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

// Какие функции вызывает тело — чтобы найти вызовы, определения которым нет
function calledNames(body: string): Set<string> {
  const names = new Set<string>();
  for (const m of body.matchAll(/\b([A-Za-z_]\w*)\s*\(/g)) names.add(m[1]);
  return names;
}

export interface LabBuild {
  file: string;
  notes: string[];
  carried: number;   // сколько задач перенесено с кодом ученика
  todo: number;      // сколько осталось заглушками
  total: number;     // сколько всего функций в файле
  renamed: number;   // у скольких функций отличается имя
  helpers: number;   // сколько вспомогательных функций подхватилось
}

export function buildLabFile(): LabBuild {
  const slotNotes: string[] = [];
  const globalNotes: string[] = [];

  // --- проход 1: собрать тела задач и все вспомогательные функции ---
  const ownBody = new Map<number, string>();          // taskId → тело её функции
  const helpers = new Map<string, { body: string; fromTask: number; signature: string }>();
  let renamed = 0;

  for (const slot of SLOTS) {
    if (slot.taskId === undefined) continue;
    const task = tasks.find((t) => t.id === slot.taskId);
    if (!task) continue;

    const open = task.template.indexOf('{');
    const platformSig = open < 0
      ? null
      : task.template.slice(0, open).replace(/#include[^\n]*/g, '').trim();
    const platformName = platformSig ? funcName(platformSig) : null;
    const labName = funcName(slot.signature);
    if (platformName && labName && platformName !== labName) renamed++;

    const saved = readSavedCode(task.id);
    if (!saved) continue;

    for (const fn of parseFunctions(saved)) {
      if (fn.name === platformName) {
        const cleaned = cleanBody(fn.body);
        if (cleaned) ownBody.set(task.id, cleaned);
      } else if (!helpers.has(fn.name)) {
        const cleaned = cleanBody(fn.body);
        if (cleaned) helpers.set(fn.name, { body: cleaned, fromTask: task.id, signature: fn.signature });
      }
    }
  }

  // --- проход 2: собрать файл ---
  const blocks: string[] = [];
  const definedNames = new Set<string>();
  let carried = 0;
  let placedHelpers = 0;
  let needsStdlib = false;

  for (const slot of SLOTS) {
    const name = funcName(slot.signature);
    if (name) definedNames.add(name);
    let body: string | null = null;

    if (slot.taskId !== undefined) {
      body = ownBody.get(slot.taskId) ?? null;
    } else {
      // вспомогательная функция из задания — ищем среди написанных учеником
      const helper = name ? helpers.get(name) : undefined;
      if (helper) {
        body = helper.body;
        placedHelpers++;
        slotNotes.push(`${name}() перенесена из вашего решения задачи ${helper.fromTask}.`);
      }
    }

    if (body) {
      carried++;
      if (STDLIB_CALLS.test(body)) needsStdlib = true;

      const task = slot.taskId !== undefined ? tasks.find((t) => t.id === slot.taskId) : null;
      const open = task ? task.template.indexOf('{') : -1;
      const platformSig = task && open >= 0
        ? task.template.slice(0, open).replace(/#include[^\n]*/g, '').trim()
        : null;

      if (platformSig) {
        const map = paramRenameMap(platformSig, slot.signature);
        if (map.size > 0) {
          body = renameParams(body, map);
          slotNotes.push(
            `Задача ${slot.taskId}: параметры переименованы ${[...map].map(([f, t]) => `${f}→${t}`).join(', ')} по всему телу. Если у вас были свои переменные с такими именами — проверьте.`
          );
        }
      }

      if (slot.returnsString) {
        const fixed = printfToReturn(body);
        body = fixed.body;
        if (fixed.left > 0) {
          slotNotes.push(
            `Задача ${slot.taskId}: ${fixed.left} вызов(а) printf/puts не удалось заменить автоматически — ${slot.mismatch}. Допишите return вручную.`
          );
        } else if (!/\breturn\b/.test(body)) {
          slotNotes.push(`Задача ${slot.taskId}: в теле нет return — ${slot.mismatch}. Без него файл не соберётся.`);
        } else if (slot.mismatch) {
          slotNotes.push(`Задача ${slot.taskId}: printf заменён на return автоматически — проверьте, что ${slot.mismatch}.`);
        }
      }
    }

    blocks.push(`${slot.comment}\n${slot.signature} {\n${body ?? TODO_BODY}\n}`);
  }

  // Вспомогательные функции, для которых в задании нет своего места.
  // Ставим их до первой задачи: вызов из тела задачи идёт раньше по файлу,
  // а в C без объявления это ошибка.
  const usedHelpers = new Set(SLOTS.filter((s) => s.taskId === undefined).map((s) => funcName(s.signature)));
  const extra: string[] = [];
  for (const [helperName, helper] of helpers) {
    if (usedHelpers.has(helperName)) continue;
    definedNames.add(helperName);
    extra.push(`// ${helperName}() — перенесена из вашего решения задачи ${helper.fromTask}\n${helper.signature} {\n${helper.body}\n}`);
    placedHelpers++;
  }
  if (extra.length > 0) {
    globalNotes.push(
      `Добавлены ваши вспомогательные функции (${extra.length}): ${[...helpers.keys()].filter((n) => !usedHelpers.has(n)).join(', ')}. Они стоят до первой задачи, чтобы вызов не опережал объявление.`
    );
  }

  const includes = ['#include "lab1.h"', '#include <math.h>', '#include <stdio.h>'];
  if (needsStdlib) {
    includes.push('#include <stdlib.h>');
    globalNotes.push('Добавлен #include <stdlib.h> — в перенесённом коде есть abs/atoi/exit или подобное.');
  }

  const head = [includes.join('\n')];
  if (extra.length > 0) head.push(extra.join('\n\n'));

  // Вызовы, которым нет определения ни в файле, ни в libc — файл не слинкуется
  for (const block of blocks) {
    for (const called of calledNames(block)) {
      if (definedNames.has(called) || LIBC_NAMES.has(called) || NOT_FUNCTIONS.has(called)) continue;
      globalNotes.push(
        `В файле вызывается ${called}(), но её определения нет ни в lab1.c, ни среди стандартных. Добавьте её или замените вызов.`
      );
      definedNames.add(called);  // не повторять одно и то же предупреждение
    }
  }

  // Незаполненные заглушки: пустое тело не-void функции не компилируется
  const todoNames: string[] = [];
  SLOTS.forEach((slot, i) => {
    if (blocks[i].includes('// TODO: реализовать')) {
      const n = funcName(slot.signature);
      if (n) todoNames.push(n);
    }
  });
  if (todoNames.length > 0) {
    globalNotes.push(
      `Остались заглушки TODO: ${todoNames.join(', ')}. Пустое тело не-void функции не компилируется — допишите их или удалите.`
    );
  }

  if (renamed > 0) {
    globalNotes.push(
      `У ${renamed} функций имя отличается от платформенного — тела перенесены под новые имена, из своего кода их нужно вызывать по-новому.`
    );
  }
  if (carried === 0) {
    globalNotes.push('Ни одного сохранённого решения не найдено: файл собран целиком из заглушек TODO.');
  }

  return {
    file: `${head.join('\n\n')}\n\n${blocks.join('\n\n')}\n`,
    notes: [...slotNotes, ...globalNotes],
    carried,
    todo: SLOTS.length - carried,
    total: SLOTS.length,
    renamed,
    helpers: placedHelpers,
  };
}
