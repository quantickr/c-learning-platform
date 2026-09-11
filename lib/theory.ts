export interface TheorySection {
  id: string;
  title: string;
  content: string;
  examples: {
    code: string;
    description: string;
  }[];
}

export const theorySections: TheorySection[] = [
  {
    id: "basics",
    title: "Основы синтаксиса C",
    content: `
# Основы синтаксиса языка C

C — это компилируемый язык программирования общего назначения. Каждая программа на C должна иметь функцию \`main()\`, с которой начинается выполнение.

## Структура программы

\`\`\`c
#include <stdio.h>  // Подключение библиотеки ввода-вывода

int main() {
    // Код программы
    printf("Hello, World!\\n");
    return 0;  // Возврат кода завершения
}
\`\`\`

## Типы данных

- \`int\` — целое число (4 байта)
- \`float\` — число с плавающей точкой (4 байта)
- \`double\` — число с плавающей точкой двойной точности (8 байт)
- \`char\` — символ (1 байт)

## Ввод и вывод

- \`printf()\` — вывод данных
- \`scanf()\` — ввод данных

\`\`\`c
int age;
scanf("%d", &age);  // Считываем целое число
printf("Ваш возраст: %d\\n", age);
\`\`\`
`,
    examples: [
      {
        code: `#include <stdio.h>

int main() {
    int number = 42;
    float pi = 3.14;
    char letter = 'A';

    printf("Число: %d\\n", number);
    printf("Пи: %.2f\\n", pi);
    printf("Буква: %c\\n", letter);

    return 0;
}`,
        description: "Пример использования различных типов данных"
      }
    ]
  },
  {
    id: "conditions",
    title: "Условные операторы",
    content: `
# Условные операторы

## Оператор if

Оператор \`if\` позволяет выполнить блок кода только при выполнении условия.

\`\`\`c
if (условие) {
    // код, если условие истинно
}
\`\`\`

## if-else

\`\`\`c
if (условие) {
    // код, если условие истинно
} else {
    // код, если условие ложно
}
\`\`\`

## if-else if-else

\`\`\`c
if (условие1) {
    // код для условия1
} else if (условие2) {
    // код для условия2
} else {
    // код, если все условия ложны
}
\`\`\`

## Операторы сравнения

- \`==\` — равно
- \`!=\` — не равно
- \`>\` — больше
- \`<\` — меньше
- \`>=\` — больше или равно
- \`<=\` — меньше или равно

## Логические операторы

- \`&&\` — логическое И (AND)
- \`||\` — логическое ИЛИ (OR)
- \`!\` — логическое НЕ (NOT)

## Тернарный оператор

\`\`\`c
результат = (условие) ? значение_если_истина : значение_если_ложь;
\`\`\`
`,
    examples: [
      {
        code: `#include <stdio.h>

int main() {
    int age;
    printf("Введите ваш возраст: ");
    scanf("%d", &age);

    if (age >= 18) {
        printf("Вы совершеннолетний\\n");
    } else {
        printf("Вы несовершеннолетний\\n");
    }

    return 0;
}`,
        description: "Проверка возраста"
      },
      {
        code: `#include <stdio.h>

int main() {
    int score;
    scanf("%d", &score);

    if (score >= 90) {
        printf("Отлично\\n");
    } else if (score >= 70) {
        printf("Хорошо\\n");
    } else if (score >= 50) {
        printf("Удовлетворительно\\n");
    } else {
        printf("Неудовлетворительно\\n");
    }

    return 0;
}`,
        description: "Определение оценки"
      },
      {
        code: `#include <stdio.h>

int main() {
    int a = 5, b = 10;

    // Тернарный оператор
    int max = (a > b) ? a : b;
    printf("Максимум: %d\\n", max);

    // Логические операторы
    if (a > 0 && b > 0) {
        printf("Оба числа положительные\\n");
    }

    return 0;
}`,
        description: "Тернарный оператор и логические операторы"
      }
    ]
  },
  {
    id: "switch",
    title: "Оператор switch",
    content: `
# Оператор switch

Оператор \`switch\` позволяет выбрать один из нескольких вариантов на основе значения переменной.

\`\`\`c
switch (переменная) {
    case значение1:
        // код для значения1
        break;
    case значение2:
        // код для значения2
        break;
    default:
        // код, если ни один case не подошёл
}
\`\`\`

## Важно!

- **break** обязателен после каждого case, иначе выполнение продолжится в следующий case
- **default** — необязательный блок, выполняется если ни один case не подошёл
- switch работает только с целыми числами и символами
`,
    examples: [
      {
        code: `#include <stdio.h>

int main() {
    int day;
    printf("Введите день недели (1-7): ");
    scanf("%d", &day);

    switch (day) {
        case 1:
            printf("Понедельник\\n");
            break;
        case 2:
            printf("Вторник\\n");
            break;
        case 3:
            printf("Среда\\n");
            break;
        case 4:
            printf("Четверг\\n");
            break;
        case 5:
            printf("Пятница\\n");
            break;
        case 6:
            printf("Суббота\\n");
            break;
        case 7:
            printf("Воскресенье\\n");
            break;
        default:
            printf("Некорректный день\\n");
    }

    return 0;
}`,
        description: "Определение дня недели"
      },
      {
        code: `#include <stdio.h>

int main() {
    char grade;
    scanf("%c", &grade);

    switch (grade) {
        case 'A':
            printf("Отлично!\\n");
            break;
        case 'B':
            printf("Хорошо\\n");
            break;
        case 'C':
            printf("Удовлетворительно\\n");
            break;
        case 'D':
        case 'F':
            printf("Плохо\\n");
            break;
        default:
            printf("Неизвестная оценка\\n");
    }

    return 0;
}`,
        description: "Несколько case для одного действия"
      }
    ]
  },
  {
    id: "loops",
    title: "Циклы",
    content: `
# Циклы

Циклы позволяют повторять блок кода несколько раз.

## Цикл for

Используется, когда известно количество повторений.

\`\`\`c
for (инициализация; условие; изменение) {
    // код цикла
}
\`\`\`

\`\`\`c
for (int i = 0; i < 10; i++) {
    printf("%d ", i);
}
\`\`\`

## Цикл while

Выполняется пока условие истинно. Проверка условия происходит ДО выполнения тела цикла.

\`\`\`c
while (условие) {
    // код цикла
}
\`\`\`

\`\`\`c
int i = 0;
while (i < 10) {
    printf("%d ", i);
    i++;
}
\`\`\`

## Цикл do-while

Выполняется пока условие истинно. Проверка условия происходит ПОСЛЕ выполнения тела цикла (гарантирует хотя бы одно выполнение).

\`\`\`c
do {
    // код цикла
} while (условие);
\`\`\`

\`\`\`c
int i = 0;
do {
    printf("%d ", i);
    i++;
} while (i < 10);
\`\`\`

## Операторы управления циклом

- \`break\` — прервать цикл
- \`continue\` — перейти к следующей итерации
`,
    examples: [
      {
        code: `#include <stdio.h>

int main() {
    // Цикл for - вывод чисел от 1 до 10
    for (int i = 1; i <= 10; i++) {
        printf("%d ", i);
    }
    printf("\\n");

    return 0;
}`,
        description: "Простой цикл for"
      },
      {
        code: `#include <stdio.h>

int main() {
    // Сумма чисел от 1 до 100
    int sum = 0;
    for (int i = 1; i <= 100; i++) {
        sum += i;
    }
    printf("Сумма: %d\\n", sum);

    return 0;
}`,
        description: "Вычисление суммы с помощью цикла"
      },
      {
        code: `#include <stdio.h>

int main() {
    int n = 12345;
    int count = 0;

    // Подсчёт цифр числа
    do {
        count++;
        n = n / 10;
    } while (n > 0);

    printf("Количество цифр: %d\\n", count);

    return 0;
}`,
        description: "Использование do-while для подсчёта цифр"
      },
      {
        code: `#include <stdio.h>

int main() {
    // Вывод только чётных чисел
    for (int i = 1; i <= 10; i++) {
        if (i % 2 != 0) {
            continue;  // Пропускаем нечётные
        }
        printf("%d ", i);
    }
    printf("\\n");

    // Прерывание цикла
    for (int i = 1; i <= 10; i++) {
        if (i > 5) {
            break;  // Прерываем на 6
        }
        printf("%d ", i);
    }
    printf("\\n");

    return 0;
}`,
        description: "Использование break и continue"
      }
    ]
  },
  {
    id: "functions",
    title: "Функции",
    content: `
# Функции

Функция — это именованный блок кода, который можно вызывать многократно.

## Синтаксис

\`\`\`c
тип_возвращаемого_значения имя_функции(параметры) {
    // тело функции
    return значение;  // если функция не void
}
\`\`\`

## Типы функций

### Функция с возвращаемым значением

\`\`\`c
int sum(int a, int b) {
    return a + b;
}
\`\`\`

### Функция без возвращаемого значения (void)

\`\`\`c
void print_hello() {
    printf("Hello!\\n");
}
\`\`\`

## Прототипы функций

Если функция вызывается до её определения, нужен прототип:

\`\`\`c
// Прототип
int sum(int a, int b);

int main() {
    int result = sum(5, 3);
    return 0;
}

// Реализация
int sum(int a, int b) {
    return a + b;
}
\`\`\`

## Параметры функций

- Параметры передаются **по значению** (копируются)
- Изменение параметра внутри функции не влияет на исходную переменную
`,
    examples: [
      {
        code: `#include <stdio.h>

// Функция вычисления факториала
int factorial(int n) {
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

int main() {
    int n = 5;
    printf("Факториал %d = %d\\n", n, factorial(n));
    return 0;
}`,
        description: "Функция вычисления факториала"
      },
      {
        code: `#include <stdio.h>

// Проверка на простое число
int is_prime(int n) {
    if (n <= 1) return 0;
    if (n == 2) return 1;
    if (n % 2 == 0) return 0;

    for (int i = 3; i * i <= n; i += 2) {
        if (n % i == 0) return 0;
    }
    return 1;
}

int main() {
    for (int i = 1; i <= 20; i++) {
        if (is_prime(i)) {
            printf("%d ", i);
        }
    }
    printf("\\n");
    return 0;
}`,
        description: "Функция проверки на простое число"
      },
      {
        code: `#include <stdio.h>

void print_stars(int n) {
    for (int i = 0; i < n; i++) {
        printf("*");
    }
    printf("\\n");
}

int max(int a, int b) {
    return (a > b) ? a : b;
}

int main() {
    print_stars(10);
    printf("Максимум из 5 и 8: %d\\n", max(5, 8));
    return 0;
}`,
        description: "Примеры void и обычных функций"
      }
    ]
  },
  {
    id: "math",
    title: "Математические операции",
    content: `
# Математические операции

## Арифметические операторы

- \`+\` — сложение
- \`-\` — вычитание
- \`*\` — умножение
- \`/\` — деление
- \`%\` — остаток от деления (только для целых чисел)

## Математические функции

Для использования математических функций нужно подключить \`<math.h>\` и при компиляции добавить флаг \`-lm\`:

\`\`\`bash
gcc program.c -lm -o program
\`\`\`

### Основные функции

- \`sqrt(x)\` — квадратный корень
- \`pow(x, y)\` — x в степени y
- \`abs(x)\` — модуль целого числа
- \`fabs(x)\` — модуль числа с плавающей точкой
- \`ceil(x)\` — округление вверх
- \`floor(x)\` — округление вниз
- \`round(x)\` — округление до ближайшего целого

### Тригонометрические функции

- \`sin(x)\`, \`cos(x)\`, \`tan(x)\` — синус, косинус, тангенс
- Аргументы в радианах!

## Приоритет операций

1. \`()\` — скобки
2. \`*\`, \`/\`, \`%\` — умножение, деление, остаток
3. \`+\`, \`-\` — сложение, вычитание
`,
    examples: [
      {
        code: `#include <stdio.h>
#include <math.h>

int main() {
    double a = 16.0;

    printf("Квадратный корень из %.0f: %.2f\\n", a, sqrt(a));
    printf("2 в степени 3: %.0f\\n", pow(2, 3));
    printf("Модуль -5: %d\\n", abs(-5));
    printf("Округление 3.7 вверх: %.0f\\n", ceil(3.7));
    printf("Округление 3.7 вниз: %.0f\\n", floor(3.7));

    return 0;
}`,
        description: "Основные математические функции"
      },
      {
        code: `#include <stdio.h>
#include <math.h>

double distance(double x1, double y1, double x2, double y2) {
    double dx = x2 - x1;
    double dy = y2 - y1;
    return sqrt(dx * dx + dy * dy);
}

int main() {
    printf("Расстояние между (0,0) и (3,4): %.2f\\n",
           distance(0, 0, 3, 4));
    return 0;
}`,
        description: "Вычисление евклидова расстояния"
      },
      {
        code: `#include <stdio.h>

int main() {
    int a = 17, b = 5;

    printf("%d / %d = %d\\n", a, b, a / b);      // Целочисленное деление: 3
    printf("%d %% %d = %d\\n", a, b, a % b);     // Остаток: 2

    double x = 17.0, y = 5.0;
    printf("%.0f / %.0f = %.2f\\n", x, y, x / y); // Вещественное деление: 3.40

    return 0;
}`,
        description: "Целочисленное и вещественное деление"
      }
    ]
  }
];
