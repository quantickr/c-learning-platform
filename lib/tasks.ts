export interface Task {
  id: number;
  title: string;
  description: string;
  type: string;
  examples: {
    input: string;
    output: string;
  }[];
  template: string;
  mainFunction: string; // main() для тестирования (скрыта от пользователя)
  tests: TestCase[];
  hints?: string[];
  relatedTheory?: string; // Теоретический материал для этой задачи
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

// Теоретические материалы для задач
const theoryContent = {
  conditionals: `## Условные операторы в C

### Оператор if-else

Условный оператор \`if\` позволяет выполнять код в зависимости от истинности условия:

\`\`\`c
if (условие) {
    // код, если условие истинно
} else {
    // код, если условие ложно
}
\`\`\`

### Операторы сравнения
- \`==\` — равно
- \`!=\` — не равно
- \`<\` — меньше
- \`>\` — больше
- \`<=\` — меньше или равно
- \`>=\` — больше или равно

### Логические операторы
- \`&&\` — логическое И (AND)
- \`||\` — логическое ИЛИ (OR)
- \`!\` — логическое НЕ (NOT)

### Примеры

**Проверка чётности:**
\`\`\`c
if (n % 2 == 0) {
    printf("Чётное");
} else {
    printf("Нечётное");
}
\`\`\`

**Сравнение нескольких чисел:**
\`\`\`c
if (a > b && a > c) {
    printf("a максимальное");
} else if (b > c) {
    printf("b максимальное");
} else {
    printf("c максимальное");
}
\`\`\`

**Тернарный оператор** (краткая форма if-else):
\`\`\`c
int result = (n > 0) ? 1 : -1;
\`\`\`
`,

  switch_case: `## Оператор switch в C

Оператор \`switch\` используется для выбора одного из множества вариантов на основе значения переменной.

### Синтаксис

\`\`\`c
switch (переменная) {
    case значение1:
        // код для значения1
        break;
    case значение2:
        // код для значения2
        break;
    default:
        // код по умолчанию
        break;
}
\`\`\`

### Важно!
- \`break\` завершает выполнение блока case
- Без \`break\` выполнение продолжится в следующий case
- \`default\` выполняется, если не подошёл ни один case

### Пример: День недели

\`\`\`c
switch (day) {
    case 1:
        printf("понедельник");
        break;
    case 2:
        printf("вторник");
        break;
    // ... другие дни
    default:
        printf("некорректно");
        break;
}
\`\`\`

### Группировка case

\`\`\`c
switch (month) {
    case 12:
    case 1:
    case 2:
        printf("зима");
        break;
    case 3:
    case 4:
    case 5:
        printf("весна");
        break;
    // и т.д.
}
\`\`\`
`,

  loops_for: `## Цикл for в C

Цикл \`for\` используется когда известно количество итераций.

### Синтаксис

\`\`\`c
for (инициализация; условие; шаг) {
    // тело цикла
}
\`\`\`

### Пример: Цикл от 1 до 10

\`\`\`c
for (int i = 1; i <= 10; i++) {
    printf("%d ", i);
}
\`\`\`

### Работа цикла for
1. **Инициализация** — выполняется один раз в начале
2. **Условие** — проверяется перед каждой итерацией
3. **Тело цикла** — выполняется, если условие истинно
4. **Шаг** — выполняется после каждой итерации

### Проверка на простое число

\`\`\`c
int is_prime = 1;
for (int i = 2; i < n; i++) {
    if (n % i == 0) {
        is_prime = 0;
        break;
    }
}
\`\`\`

### Подсчёт кратных чисел

\`\`\`c
int count = 0;
for (int i = start; i <= end; i++) {
    if (i % k == 0) {
        count++;
    }
}
\`\`\`
`,

  loops_dowhile: `## Цикл do-while в C

Цикл \`do-while\` выполняет тело **минимум один раз**, затем проверяет условие.

### Синтаксис

\`\`\`c
do {
    // тело цикла
} while (условие);
\`\`\`

### Отличие от while
- \`while\` — проверяет условие **до** выполнения
- \`do-while\` — проверяет условие **после** выполнения

### Работа с числами

Цикл \`do-while\` идеален для обработки цифр числа:

\`\`\`c
int n = 12345;
do {
    int digit = n % 10;  // Получаем последнюю цифру
    printf("%d ", digit);
    n = n / 10;          // Убираем последнюю цифру
} while (n > 0);
\`\`\`

### Подсчёт цифр

\`\`\`c
int count = 0;
int temp = abs(n);
do {
    count++;
    temp /= 10;
} while (temp > 0);
\`\`\`

### Реверс числа

\`\`\`c
int reversed = 0;
do {
    reversed = reversed * 10 + n % 10;
    n /= 10;
} while (n != 0);
\`\`\`
`,

  math_operations: `## Математические операции в C

### Библиотека math.h

Для математических функций подключите \`<math.h>\`:
\`\`\`c
#include <math.h>
\`\`\`

### Основные функции

**Корень и степень:**
- \`sqrt(x)\` — квадратный корень
- \`pow(x, y)\` — x в степени y

**Модуль:**
- \`abs(x)\` — модуль целого числа
- \`fabs(x)\` — модуль дробного числа

**Округление:**
- \`ceil(x)\` — округление вверх
- \`floor(x)\` — округление вниз
- \`round(x)\` — округление к ближайшему

### Евклидово расстояние

Расстояние между точками (x1, y1) и (x2, y2):

\`\`\`c
double dx = x2 - x1;
double dy = y2 - y1;
double distance = sqrt(dx*dx + dy*dy);
\`\`\`

### Манхэттенское расстояние

Сумма модулей разностей координат:

\`\`\`c
int manhattan = abs(x2 - x1) + abs(y2 - y1);
\`\`\`

### Компиляция с math.h

При компиляции добавьте флаг \`-lm\`:
\`\`\`bash
gcc program.c -lm -o program
\`\`\`
`,

  leap_year: `## Високосный год

Високосный год — это год, в котором 366 дней вместо обычных 365.

### Правила определения

Год является високосным, если:
1. Делится на 4 **И** не делится на 100
2. **ИЛИ** делится на 400

### Формула

\`\`\`c
if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
    // високосный
} else {
    // не високосный
}
\`\`\`

### Примеры

- **2000** — високосный (делится на 400) ✓
- **1900** — не високосный (делится на 100, но не на 400) ✗
- **2024** — високосный (делится на 4, не на 100) ✓
- **2023** — не високосный (не делится на 4) ✗

### Логические операторы

- \`&&\` — логическое И (оба условия истинны)
- \`||\` — логическое ИЛИ (хотя бы одно истинно)
- \`!\` — логическое НЕ (инверсия)

### Приоритет операторов

Скобки важны! Условие:
\`\`\`c
(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
\`\`\`

Без правильных скобок логика будет нарушена.
`
};

export const tasks: Task[] = [
  {
    id: 1,
    title: "Чётное или нечётное",
    description: "Проверить число на чётность. Вернуть 1 если число чётное, 0 если нечётное.",
    type: "if",
    examples: [
      { input: "4", output: "1" },
      { input: "5", output: "0" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

int is_even(int n) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}`,
    mainFunction: `
int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", is_even(n));
    return 0;
}`,
    tests: [
      { input: "4", expectedOutput: "1" },
      { input: "5", expectedOutput: "0" },
      { input: "0", expectedOutput: "1" },
      { input: "-2", expectedOutput: "1" },
      { input: "-3", expectedOutput: "0" },
      { input: "1000000", expectedOutput: "1" },
      { input: "1000001", expectedOutput: "0" },
      { input: "2", expectedOutput: "1" },
      { input: "1", expectedOutput: "0" },
      { input: "-100", expectedOutput: "1" },
      { input: "-999", expectedOutput: "0" },
      { input: "9999", expectedOutput: "0" },
      { input: "10000", expectedOutput: "1" },
      { input: "-1", expectedOutput: "0" },
      { input: "777", expectedOutput: "0" },
      { input: "888", expectedOutput: "1" },
      { input: "2147483647", expectedOutput: "0", description: "INT_MAX — нечётное" },
      { input: "-2147483648", expectedOutput: "1", description: "INT_MIN — чётное; % 2 для него безопасен" }
    ]
  ,
    relatedTheory: theoryContent.conditionals},
  {
    id: 2,
    title: "Максимум из трёх чисел",
    description: "Найти наибольшее из трёх чисел.",
    type: "if",
    examples: [
      { input: "5 8 2", output: "8" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

int max_of_three(int a, int b, int c) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    printf("%d\\n", max_of_three(a, b, c));
    return 0;
}`,
    tests: [
      { input: "5 8 2", expectedOutput: "8" },
      { input: "10 5 7", expectedOutput: "10" },
      { input: "3 9 9", expectedOutput: "9" },
      { input: "-1 -5 -3", expectedOutput: "-1" },
      { input: "0 0 0", expectedOutput: "0" },
      { input: "100 200 150", expectedOutput: "200" },
      { input: "-10 -20 -30", expectedOutput: "-10" },
      { input: "1 1 1", expectedOutput: "1" },
      { input: "50 50 49", expectedOutput: "50" },
      { input: "-5 0 5", expectedOutput: "5" },
      { input: "999 1000 998", expectedOutput: "1000" },
      { input: "7 7 8", expectedOutput: "8" },
      { input: "100 100 100", expectedOutput: "100" },
      { input: "2147483647 -2147483648 0", expectedOutput: "2147483647", description: "INT_MAX и INT_MIN рядом" },
      { input: "-2147483648 -2147483648 -2147483648", expectedOutput: "-2147483648", description: "все три INT_MIN" },
      { input: "2147483647 2147483647 2147483647", expectedOutput: "2147483647", description: "все три INT_MAX" }
    ]
  ,
    relatedTheory: theoryContent.conditionals},
  {
    id: 3,
    title: "Знак числа",
    description: "Определить знак числа: положительное (1), отрицательное (-1) или ноль (0).",
    type: "if",
    examples: [
      { input: "-3", output: "-1" },
      { input: "5", output: "1" },
      { input: "0", output: "0" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

int sign(int n) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", sign(n));
    return 0;
}`,
    tests: [
      { input: "-3", expectedOutput: "-1" },
      { input: "5", expectedOutput: "1" },
      { input: "0", expectedOutput: "0" },
      { input: "-1000", expectedOutput: "-1" },
      { input: "1", expectedOutput: "1" },
      { input: "-1", expectedOutput: "-1" },
      { input: "100", expectedOutput: "1" },
      { input: "-50", expectedOutput: "-1" },
      { input: "999999", expectedOutput: "1" },
      { input: "-999999", expectedOutput: "-1" },
      { input: "2147483647", expectedOutput: "1", description: "INT_MAX" },
      { input: "-2147483648", expectedOutput: "-1", description: "INT_MIN" }
    ]
  ,
    relatedTheory: theoryContent.conditionals},
  {
    id: 4,
    title: "Абсолютное значение",
    description: "Вычислить модуль числа без использования встроенных функций. На вход подаются значения от -2147483647 до 2147483647: модуль INT_MIN равен 2147483648 и в int не помещается.",
    type: "if",
    examples: [
      { input: "-7", output: "7" },
      { input: "5", output: "5" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

int absolute(int n) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", absolute(n));
    return 0;
}`,
    tests: [
      { input: "-7", expectedOutput: "7" },
      { input: "5", expectedOutput: "5" },
      { input: "0", expectedOutput: "0" },
      { input: "-2147483647", expectedOutput: "2147483647" },
      { input: "100", expectedOutput: "100" },
      { input: "-100", expectedOutput: "100" },
      { input: "1", expectedOutput: "1" },
      { input: "-1", expectedOutput: "1" },
      { input: "9999", expectedOutput: "9999" },
      { input: "-9999", expectedOutput: "9999" },
      { input: "42", expectedOutput: "42" },
      { input: "-42", expectedOutput: "42" },
      { input: "2147483647", expectedOutput: "2147483647", description: "INT_MAX — модуль равен самому числу" }
    ]
  ,
    relatedTheory: theoryContent.conditionals},
  {
    id: 5,
    title: "Треугольник существует",
    description: "Проверить, можно ли построить треугольник по трём сторонам. Вернуть 1 если можно, 0 если нельзя. Стороны в тестах подобраны так, что сумма двух из них не переполняет int.",
    type: "if",
    examples: [
      { input: "3 4 5", output: "1" },
      { input: "3 2 5", output: "0" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

int is_triangle(int a, int b, int c) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    printf("%d\\n", is_triangle(a, b, c));
    return 0;
}`,
    tests: [
      { input: "3 4 5", expectedOutput: "1" },
      { input: "3 2 5", expectedOutput: "0" },
      { input: "1 1 1", expectedOutput: "1" },
      { input: "10 5 3", expectedOutput: "0" },
      { input: "5 12 13", expectedOutput: "1" },
      { input: "1 2 3", expectedOutput: "0", description: "1+2=3, сумма двух сторон равна третьей" },
      { input: "2 2 2", expectedOutput: "1" },
      { input: "7 24 25", expectedOutput: "1" },
      { input: "1 1 10", expectedOutput: "0" },
      { input: "6 8 10", expectedOutput: "1" },
      { input: "100 100 100", expectedOutput: "1" },
      { input: "1 10 100", expectedOutput: "0" },
      { input: "5 5 9", expectedOutput: "1" },
      { input: "5 5 10", expectedOutput: "0" },
      { input: "3 4 7", expectedOutput: "0" },
      { input: "1000000 1000000 1000000", expectedOutput: "1", description: "большие стороны, но сумма не переполняет int" },
      { input: "1000000000 1 1", expectedOutput: "0", description: "1+1 далеко не дотягивает до 10^9" }
    ]
  ,
    relatedTheory: theoryContent.conditionals},
  {
    id: 6,
    title: "Класс оценок",
    description: "Ввести число от 0 до 100 и вывести: «отлично» (90-100), «хорошо» (70-89), «удовлетворительно» (50-69), «неудовлетворительно» (0-49).",
    type: "if",
    examples: [
      { input: "91", output: "отлично" },
      { input: "78", output: "хорошо" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

void grade_class(int score) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int score;
    scanf("%d", &score);
    grade_class(score);
    return 0;
}`,
    tests: [
      { input: "91", expectedOutput: "отлично" },
      { input: "78", expectedOutput: "хорошо" },
      { input: "65", expectedOutput: "удовлетворительно" },
      { input: "45", expectedOutput: "неудовлетворительно" },
      { input: "100", expectedOutput: "отлично" },
      { input: "0", expectedOutput: "неудовлетворительно" },
      { input: "90", expectedOutput: "отлично" },
      { input: "89", expectedOutput: "хорошо" },
      { input: "70", expectedOutput: "хорошо" },
      { input: "69", expectedOutput: "удовлетворительно" },
      { input: "50", expectedOutput: "удовлетворительно" },
      { input: "49", expectedOutput: "неудовлетворительно" },
      { input: "95", expectedOutput: "отлично" },
      { input: "75", expectedOutput: "хорошо" },
      { input: "55", expectedOutput: "удовлетворительно" },
      { input: "25", expectedOutput: "неудовлетворительно" }
    ]
  ,
    relatedTheory: theoryContent.conditionals},
  {
    id: 7,
    title: "Евклидово расстояние между точками",
    description: "Вычислить расстояние между точками (x1, y1) и (x2, y2) по формуле sqrt((x2-x1)² + (y2-y1)²).",
    type: "math",
    examples: [
      { input: "0 0 3 4", output: "5.000000" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>
#include <math.h>

double euclidean_distance(double x1, double y1, double x2, double y2) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    double x1, y1, x2, y2;
    scanf("%lf %lf %lf %lf", &x1, &y1, &x2, &y2);
    printf("%f\\n", euclidean_distance(x1, y1, x2, y2));
    return 0;
}`,
    tests: [
      { input: "0 0 3 4", expectedOutput: "5.000000" },
      { input: "1 1 4 5", expectedOutput: "5.000000" },
      { input: "0 0 0 0", expectedOutput: "0.000000" },
      { input: "-3 -4 0 0", expectedOutput: "5.000000" },
      { input: "1 2 4 6", expectedOutput: "5.000000" },
      { input: "0 0 1 1", expectedOutput: "1.414214" },
      { input: "-5 -5 5 5", expectedOutput: "14.142136" },
      { input: "10 10 10 10", expectedOutput: "0.000000" },
      { input: "3 4 6 8", expectedOutput: "5.000000" },
      { input: "0 0 10 0", expectedOutput: "10.000000" },
      { input: "0 0 0 10", expectedOutput: "10.000000" },
      { input: "0 0 2147483647 0", expectedOutput: "2147483647.000000", description: "INT_MAX по оси X — double держит его точно" },
      { input: "-2147483648 0 2147483647 0", expectedOutput: "4294967295.000000", description: "от INT_MIN до INT_MAX: в int не влезло бы, в double влезает" }
    ]
  ,
    relatedTheory: theoryContent.math_operations},
  {
    id: 8,
    title: "Манхэттенское расстояние между точками",
    description: "Вычислить манхэттенское расстояние между точками (x1, y1) и (x2, y2) по формуле |x2-x1| + |y2-y1|. Координаты в тестах подобраны так, что сумма модулей не переполняет int.",
    type: "math",
    examples: [
      { input: "1 2 4 6", output: "7" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

int manhattan_distance(int x1, int y1, int x2, int y2) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int x1, y1, x2, y2;
    scanf("%d %d %d %d", &x1, &y1, &x2, &y2);
    printf("%d\\n", manhattan_distance(x1, y1, x2, y2));
    return 0;
}`,
    tests: [
      { input: "1 2 4 6", expectedOutput: "7" },
      { input: "0 0 0 0", expectedOutput: "0" },
      { input: "-3 -4 3 4", expectedOutput: "14" },
      { input: "5 5 5 5", expectedOutput: "0" },
      { input: "0 0 10 10", expectedOutput: "20" },
      { input: "1 1 1 1", expectedOutput: "0" },
      { input: "-5 -5 5 5", expectedOutput: "20" },
      { input: "10 20 30 40", expectedOutput: "40" },
      { input: "0 0 5 0", expectedOutput: "5" },
      { input: "0 0 0 5", expectedOutput: "5" },
      { input: "100 100 200 200", expectedOutput: "200" },
      { input: "-1000000 -1000000 1000000 1000000", expectedOutput: "4000000", description: "большие координаты, сумма модулей не переполняет int" }
    ]
  ,
    relatedTheory: theoryContent.math_operations},
  {
    id: 9,
    title: "Простые числа в интервале",
    description: "Вычислить среднее арифметическое значение между всеми простыми числами в интервале [a, b] включительно.",
    type: "for",
    examples: [
      { input: "0 10", output: "4.250000" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

double average_primes(int a, int b) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%f\\n", average_primes(a, b));
    return 0;
}`,
    tests: [
      { input: "0 10", expectedOutput: "4.250000", description: "Простые: 2,3,5,7 => (2+3+5+7)/4 = 4.25" },
      { input: "10 20", expectedOutput: "15.000000", description: "Простые: 11,13,17,19" },
      { input: "1 1", expectedOutput: "0.000000", description: "Нет простых чисел" },
      { input: "2 2", expectedOutput: "2.000000" },
      { input: "1 10", expectedOutput: "4.250000" },
      { input: "20 30", expectedOutput: "26.000000", description: "Простые: 23,29" },
      { input: "0 5", expectedOutput: "3.333333", description: "Простые: 2,3,5" },
      { input: "5 10", expectedOutput: "6.000000", description: "Простые: 5,7" },
      { input: "11 11", expectedOutput: "11.000000" },
      { input: "0 1", expectedOutput: "0.000000" },
      { input: "2 10", expectedOutput: "4.250000", description: "Простые: 2,3,5,7" },
      { input: "1 20", expectedOutput: "9.625000", description: "Простые: 2,3,5,7,11,13,17,19" },
      { input: "1 1000", expectedOutput: "453.136905", description: "168 простых, сумма 76127" },
      { input: "900 1000", expectedOutput: "952.142857", description: "14 простых от 907 до 997" }
    ],
    hints: [
      "Простые числа: числа больше 1, которые делятся только на 1 и на себя",
      "Число 1 не является простым",
      "Если простых чисел нет, вернуть 0.0"
    ]
  ,
    relatedTheory: theoryContent.loops_for},
  {
    id: 10,
    title: "Кратные числа в интервале",
    description: "Посчитать количество чисел в интервале [a, b], кратных числу k.",
    type: "for",
    examples: [
      { input: "1 10 2", output: "5" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

int count_multiples(int a, int b, int k) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int a, b, k;
    scanf("%d %d %d", &a, &b, &k);
    printf("%d\\n", count_multiples(a, b, k));
    return 0;
}`,
    tests: [
      { input: "1 10 2", expectedOutput: "5", description: "2,4,6,8,10" },
      { input: "5 15 3", expectedOutput: "4", description: "6,9,12,15" },
      { input: "1 10 1", expectedOutput: "10" },
      { input: "10 10 5", expectedOutput: "1" },
      { input: "1 20 5", expectedOutput: "4", description: "5,10,15,20" },
      { input: "0 100 10", expectedOutput: "11", description: "0,10,20...100" },
      { input: "1 100 7", expectedOutput: "14" },
      { input: "5 50 4", expectedOutput: "11" },
      { input: "1 1 1", expectedOutput: "1" },
      { input: "2 20 2", expectedOutput: "10" },
      { input: "11 19 3", expectedOutput: "3", description: "12,15,18" },
      { input: "7 7 3", expectedOutput: "0", description: "одно число, не кратно k" },
      { input: "1 10 10", expectedOutput: "1", description: "кратно только само 10" },
      { input: "1 10 11", expectedOutput: "0", description: "k больше всего отрезка" },
      { input: "-10 10 5", expectedOutput: "5", description: "отрицательные границы: -10,-5,0,5,10" }
    ]
  ,
    relatedTheory: theoryContent.loops_for},
  {
    id: 11,
    title: "Високосный год",
    description: "Определить, является ли год високосным. Правила: год високосный, если он делится на 4, но НЕ делится на 100, ИЛИ делится на 400.",
    type: "if",
    examples: [
      { input: "2000", output: "1" },
      { input: "1900", output: "0" },
      { input: "2024", output: "1" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

int is_leap_year(int year) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int year;
    scanf("%d", &year);
    printf("%d\\n", is_leap_year(year));
    return 0;
}`,
    tests: [
      { input: "2000", expectedOutput: "1", description: "Делится на 400" },
      { input: "1900", expectedOutput: "0", description: "Делится на 100, но не на 400" },
      { input: "2024", expectedOutput: "1", description: "Делится на 4, не на 100" },
      { input: "2023", expectedOutput: "0", description: "Не делится на 4" },
      { input: "2100", expectedOutput: "0", description: "Делится на 100, но не на 400" },
      { input: "2400", expectedOutput: "1", description: "Делится на 400" },
      { input: "2004", expectedOutput: "1" },
      { input: "2001", expectedOutput: "0" },
      { input: "1600", expectedOutput: "1" },
      { input: "1700", expectedOutput: "0" },
      { input: "1800", expectedOutput: "0" },
      { input: "2020", expectedOutput: "1" },
      { input: "2021", expectedOutput: "0" },
      { input: "2200", expectedOutput: "0" },
      { input: "2800", expectedOutput: "1" },
      { input: "2147483647", expectedOutput: "0", description: "INT_MAX: 2147483647 % 4 = 3" },
      { input: "2147483644", expectedOutput: "1", description: "наибольший високосный год, влезающий в int" }
    ],
    hints: [
      "Год високосный если: (делится на 4 И НЕ делится на 100) ИЛИ (делится на 400)",
      "Порядок проверки важен!"
    ]
  ,
    relatedTheory: theoryContent.leap_year},
  {
    id: 12,
    title: "Сезон по номеру месяца",
    description: "Определить сезон года по номеру месяца (1–12). Зима: 12,1,2; Весна: 3,4,5; Лето: 6,7,8; Осень: 9,10,11.",
    type: "switch",
    examples: [
      { input: "1", output: "зима" },
      { input: "4", output: "весна" },
      { input: "13", output: "некорректно" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

void season(int month) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int month;
    scanf("%d", &month);
    season(month);
    return 0;
}`,
    tests: [
      { input: "1", expectedOutput: "зима" },
      { input: "4", expectedOutput: "весна" },
      { input: "7", expectedOutput: "лето" },
      { input: "10", expectedOutput: "осень" },
      { input: "13", expectedOutput: "некорректно" },
      { input: "0", expectedOutput: "некорректно" },
      { input: "2", expectedOutput: "зима" },
      { input: "12", expectedOutput: "зима" },
      { input: "3", expectedOutput: "весна" },
      { input: "5", expectedOutput: "весна" },
      { input: "6", expectedOutput: "лето" },
      { input: "8", expectedOutput: "лето" },
      { input: "9", expectedOutput: "осень" },
      { input: "11", expectedOutput: "осень" },
      { input: "-1", expectedOutput: "некорректно" },
      { input: "100", expectedOutput: "некорректно" },
      { input: "2147483647", expectedOutput: "некорректно", description: "INT_MAX" },
      { input: "-2147483648", expectedOutput: "некорректно", description: "INT_MIN" }
    ]
  ,
    relatedTheory: theoryContent.switch_case},
  {
    id: 13,
    title: "День недели",
    description: "По номеру дня недели (1-7) вывести его название. 1=понедельник, 7=воскресенье.",
    type: "switch",
    examples: [
      { input: "1", output: "понедельник" },
      { input: "7", output: "воскресенье" },
      { input: "743", output: "некорректно" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

void day_of_week(int day) {
    // Ваш код здесь

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int day;
    scanf("%d", &day);
    day_of_week(day);
    return 0;
}`,
    tests: [
      { input: "1", expectedOutput: "понедельник" },
      { input: "2", expectedOutput: "вторник" },
      { input: "3", expectedOutput: "среда" },
      { input: "4", expectedOutput: "четверг" },
      { input: "5", expectedOutput: "пятница" },
      { input: "6", expectedOutput: "суббота" },
      { input: "7", expectedOutput: "воскресенье" },
      { input: "743", expectedOutput: "некорректно" },
      { input: "0", expectedOutput: "некорректно" },
      { input: "8", expectedOutput: "некорректно" },
      { input: "-1", expectedOutput: "некорректно" },
      { input: "100", expectedOutput: "некорректно" },
      { input: "2147483647", expectedOutput: "некорректно", description: "INT_MAX" },
      { input: "-2147483648", expectedOutput: "некорректно", description: "INT_MIN" }
    ]
  ,
    relatedTheory: theoryContent.switch_case},
  {
    id: 14,
    title: "Подсчёт цифр в числе",
    description: "Подсчитать количество цифр в числе. Используйте цикл do-while. На вход подаются значения от -2147483647 до 2147483647: для INT_MIN модуль не помещается в int.",
    type: "do-while",
    examples: [
      { input: "2020", output: "4" },
      { input: "7", output: "1" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

int count_digits(int n) {
    // Ваш код здесь
    // Используйте do-while!

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", count_digits(n));
    return 0;
}`,
    tests: [
      { input: "2020", expectedOutput: "4" },
      { input: "7", expectedOutput: "1" },
      { input: "0", expectedOutput: "1" },
      { input: "-123", expectedOutput: "3" },
      { input: "1000000", expectedOutput: "7" },
      { input: "999", expectedOutput: "3" },
      { input: "12345", expectedOutput: "5" },
      { input: "1", expectedOutput: "1" },
      { input: "-1", expectedOutput: "1" },
      { input: "100", expectedOutput: "3" },
      { input: "-9999", expectedOutput: "4" },
      { input: "42", expectedOutput: "2" },
      { input: "987654321", expectedOutput: "9" },
      { input: "2147483647", expectedOutput: "10", description: "INT_MAX — 10 цифр" },
      { input: "-2147483647", expectedOutput: "10", description: "-INT_MAX: знак не считается" }
    ],
    hints: [
      "Используйте do-while для обработки каждой цифры",
      "Для отрицательных чисел считайте количество цифр без знака минус"
    ]
  ,
    relatedTheory: theoryContent.loops_dowhile},
  {
    id: 15,
    title: "Реверс числа",
    description: "Развернуть число задом наперёд. Например, 123 -> 321. Используйте цикл do-while. На вход подаются значения от -2147483647 до 2147483647, перевёрнутое число тоже помещается в int.",
    type: "do-while",
    examples: [
      { input: "123", output: "321" },
      { input: "1000", output: "1" }
    ],
    template: `#include <stdio.h>
#include <stdlib.h>

int reverse_number(int n) {
    // Ваш код здесь
    // Используйте do-while!

    exit(0); // заглушка: пока решения нет, программа завершается без вывода
}
`,
    mainFunction: `
int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", reverse_number(n));
    return 0;
}`,
    tests: [
      { input: "123", expectedOutput: "321" },
      { input: "1000", expectedOutput: "1" },
      { input: "0", expectedOutput: "0" },
      { input: "-456", expectedOutput: "-654" },
      { input: "100", expectedOutput: "1" },
      { input: "12345", expectedOutput: "54321" },
      { input: "9876", expectedOutput: "6789" },
      { input: "1", expectedOutput: "1" },
      { input: "-1", expectedOutput: "-1" },
      { input: "999", expectedOutput: "999" },
      { input: "-1000", expectedOutput: "-1" },
      { input: "7", expectedOutput: "7" },
      { input: "10", expectedOutput: "1" },
      { input: "-99", expectedOutput: "-99" },
      { input: "2020", expectedOutput: "202" },
      { input: "1234567890", expectedOutput: "987654321", description: "ноль в конце теряется" },
      { input: "-1234567890", expectedOutput: "-987654321", description: "знак сохраняется" },
      { input: "1000000000", expectedOutput: "1", description: "миллиард превращается в единицу" }
    ],
    hints: [
      "Используйте do-while для обработки каждой цифры",
      "Для отрицательных чисел сохраните знак"
    ]
  ,
    relatedTheory: theoryContent.loops_dowhile}
];
