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
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

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

int is_even(int n) {
    // Ваш код здесь

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
      { input: "888", expectedOutput: "1" }
    ]
  },
  {
    id: 2,
    title: "Максимум из трёх чисел",
    description: "Найти наибольшее из трёх чисел.",
    type: "if",
    examples: [
      { input: "5 8 2", output: "8" }
    ],
    template: `#include <stdio.h>

int max_of_three(int a, int b, int c) {
    // Ваш код здесь

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
      { input: "100 100 100", expectedOutput: "100" }
    ]
  },
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

int sign(int n) {
    // Ваш код здесь

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
      { input: "-999999", expectedOutput: "-1" }
    ]
  },
  {
    id: 4,
    title: "Абсолютное значение",
    description: "Вычислить модуль числа без использования встроенных функций.",
    type: "if",
    examples: [
      { input: "-7", output: "7" },
      { input: "5", output: "5" }
    ],
    template: `#include <stdio.h>

int absolute(int n) {
    // Ваш код здесь

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
      { input: "-42", expectedOutput: "42" }
    ]
  },
  {
    id: 5,
    title: "Треугольник существует",
    description: "Проверить, можно ли построить треугольник по трём сторонам. Вернуть 1 если можно, 0 если нельзя.",
    type: "if",
    examples: [
      { input: "3 4 5", output: "1" },
      { input: "3 2 5", output: "0" }
    ],
    template: `#include <stdio.h>

int is_triangle(int a, int b, int c) {
    // Ваш код здесь

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
      { input: "3 4 7", expectedOutput: "0" }
    ]
  },
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

void grade_class(int score) {
    // Ваш код здесь

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
  },
  {
    id: 7,
    title: "Евклидово расстояние между точками",
    description: "Вычислить расстояние между точками (x1, y1) и (x2, y2) по формуле sqrt((x2-x1)² + (y2-y1)²).",
    type: "math",
    examples: [
      { input: "0 0 3 4", output: "5.000000" }
    ],
    template: `#include <stdio.h>
#include <math.h>

double euclidean_distance(double x1, double y1, double x2, double y2) {
    // Ваш код здесь

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
      { input: "0 0 0 10", expectedOutput: "10.000000" }
    ]
  },
  {
    id: 8,
    title: "Манхэттенское расстояние между точками",
    description: "Вычислить манхэттенское расстояние между точками (x1, y1) и (x2, y2) по формуле |x2-x1| + |y2-y1|.",
    type: "math",
    examples: [
      { input: "1 2 4 6", output: "7" }
    ],
    template: `#include <stdio.h>

int manhattan_distance(int x1, int y1, int x2, int y2) {
    // Ваш код здесь

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
      { input: "100 100 200 200", expectedOutput: "200" }
    ]
  },
  {
    id: 9,
    title: "Простые числа в интервале",
    description: "Вычислить среднее арифметическое значение между всеми простыми числами в интервале [a, b] включительно.",
    type: "for",
    examples: [
      { input: "0 10", output: "4.250000" }
    ],
    template: `#include <stdio.h>

double average_primes(int a, int b) {
    // Ваш код здесь

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
      { input: "10 20", expectedOutput: "14.500000", description: "Простые: 11,13,17,19" },
      { input: "1 1", expectedOutput: "0.000000", description: "Нет простых чисел" },
      { input: "2 2", expectedOutput: "2.000000" },
      { input: "1 10", expectedOutput: "4.250000" },
      { input: "20 30", expectedOutput: "25.000000", description: "Простые: 23,29" },
      { input: "0 5", expectedOutput: "3.333333", description: "Простые: 2,3,5" },
      { input: "5 10", expectedOutput: "6.000000", description: "Простые: 5,7" },
      { input: "11 11", expectedOutput: "11.000000" },
      { input: "0 1", expectedOutput: "0.000000" },
      { input: "2 10", expectedOutput: "4.750000", description: "Простые: 2,3,5,7" },
      { input: "1 20", expectedOutput: "9.666667", description: "Простые: 2,3,5,7,11,13,17,19" }
    ],
    hints: [
      "Простые числа: числа больше 1, которые делятся только на 1 и на себя",
      "Число 1 не является простым",
      "Если простых чисел нет, вернуть 0.0"
    ]
  },
  {
    id: 10,
    title: "Кратные числа в интервале",
    description: "Посчитать количество чисел в интервале [a, b], кратных числу k.",
    type: "for",
    examples: [
      { input: "1 10 2", output: "5" }
    ],
    template: `#include <stdio.h>

int count_multiples(int a, int b, int k) {
    // Ваш код здесь

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
      { input: "0 100 10", expectedOutput: "10", description: "0,10,20...100" },
      { input: "1 100 7", expectedOutput: "14" },
      { input: "5 50 4", expectedOutput: "12" },
      { input: "1 1 1", expectedOutput: "1" },
      { input: "2 20 2", expectedOutput: "10" },
      { input: "11 19 3", expectedOutput: "3", description: "12,15,18" }
    ]
  },
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

int is_leap_year(int year) {
    // Ваш код здесь

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
      { input: "2800", expectedOutput: "1" }
    ],
    hints: [
      "Год високосный если: (делится на 4 И НЕ делится на 100) ИЛИ (делится на 400)",
      "Порядок проверки важен!"
    ]
  },
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

void season(int month) {
    // Ваш код здесь

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
      { input: "100", expectedOutput: "некорректно" }
    ]
  },
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

void day_of_week(int day) {
    // Ваш код здесь

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
      { input: "100", expectedOutput: "некорректно" }
    ]
  },
  {
    id: 14,
    title: "Подсчёт цифр в числе",
    description: "Подсчитать количество цифр в числе. Используйте цикл do-while.",
    type: "do-while",
    examples: [
      { input: "2020", output: "4" },
      { input: "7", output: "1" }
    ],
    template: `#include <stdio.h>

int count_digits(int n) {
    // Ваш код здесь
    // Используйте do-while!

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
      { input: "987654321", expectedOutput: "9" }
    ],
    hints: [
      "Используйте do-while для обработки каждой цифры",
      "Для отрицательных чисел считайте количество цифр без знака минус"
    ]
  },
  {
    id: 15,
    title: "Реверс числа",
    description: "Развернуть число задом наперёд. Например, 123 -> 321. Используйте цикл do-while.",
    type: "do-while",
    examples: [
      { input: "123", output: "321" },
      { input: "1000", output: "1" }
    ],
    template: `#include <stdio.h>

int reverse_number(int n) {
    // Ваш код здесь
    // Используйте do-while!

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
      { input: "2020", expectedOutput: "202" }
    ],
    hints: [
      "Используйте do-while для обработки каждой цифры",
      "Для отрицательных чисел сохраните знак"
    ]
  }
];
