// Доступ к коду, сохранённому в localStorage. Отдельным модулем, потому что
// читают его двое: редактор задачи и сборка lab1.c — ключи не должны разъехаться.

export const codeKey = (id: number) => `task_${id}_code`;
export const tplKey = (id: number) => `task_${id}_tpl`;

// Приватный режим и заблокированное хранилище бросают исключение даже на
// чтение, поэтому всё обёрнуто: отсутствие сохранения не должно ломать страницу.
export function readSavedCode(id: number): string | null {
  try {
    return localStorage.getItem(codeKey(id));
  } catch {
    return null;
  }
}

export function readSavedTemplate(id: number): string | null {
  try {
    return localStorage.getItem(tplKey(id));
  } catch {
    return null;
  }
}

export function writeSavedCode(id: number, code: string, template: string): void {
  try {
    localStorage.setItem(codeKey(id), code);
    localStorage.setItem(tplKey(id), template);
  } catch {
    /* хранилище недоступно — просто не сохраняем */
  }
}

export function clearSavedCode(id: number): void {
  try {
    localStorage.removeItem(codeKey(id));
    localStorage.removeItem(tplKey(id));
  } catch {
    /* не критично */
  }
}

// Кэши, оставшиеся до появления tplKey, несут код без отметки шаблона.
// Из них безопасно выбросить только заведомо нерабочие: без return, printf
// и exit код не проходит ни одного теста ни на одной из задач. Остальное
// может быть настоящей работой — оставляем.
export function isDeadLegacyCode(src: string): boolean {
  const stripped = src.replace(/\/\/[^\n]*/g, '');
  return !/\b(return|printf|puts|putchar|exit)\b/.test(stripped);
}
