// Заготовка lab1.c — все 15 задач одним файлом для сдачи лабораторной.
//
// ВАЖНО: сигнатуры здесь следуют спецификации лабораторной, а не шаблонам
// платформы. Расходятся восемь из пятнадцати, поэтому решение, написанное
// в редакторе, нельзя просто перенести сюда копипастом:
//
//   задача  platform (lib/tasks.ts)        lab1.c
//   3       sign                           sign_of_number
//   4       absolute                       absolute_value
//   5       is_triangle                    triangle_exists
//   6       void grade_class(int) + printf const char* get_grade(int)
//   9       average_primes                 average_primes_in_interval
//   10      count_multiples(a, b, k)       count_multiples(start, end, k)
//   12      void season(int) + printf      const char* season_by_month(int)
//   13      void day_of_week(int) + printf const char* day_of_week(int)
//
// Задачи 6, 12 и 13 расходятся по сути, а не только по имени: платформа
// печатает строку сама, а лабораторная требует вернуть указатель на неё.

export const LAB1_FILENAME = 'lab1.c';

export const LAB1_FILE = `#include "lab1.h"
#include <math.h>
#include <stdio.h>

// Задача 1 - Чётное или нечётное
int is_even(int n) {
    // TODO: реализовать
}

// Задача 2 - Максимум из трёх чисел
int max_of_three(int a, int b, int c) {
    // TODO: реализовать
}

// Задача 3 - Знак числа
int sign_of_number(int n) {
    // TODO: реализовать
}

// Задача 4 - Абсолютное значение
int absolute_value(int n) {
    // TODO: реализовать
}

// Задача 5 - Треугольник существует
int triangle_exists(int a, int b, int c) {
    // TODO: реализовать
}

// Задача 6 - Класс оценок
const char* get_grade(int score) {
    // TODO: реализовать
}

// Задача 7 - Евклидово расстояние
double euclidean_distance(double x1, double y1, double x2, double y2) {
    // TODO: реализовать
}

// Задача 8 - Манхэттенское расстояние
int manhattan_distance(int x1, int y1, int x2, int y2) {
    // TODO: реализовать
}

// Вспомогательная функция для проверки простоты (можно писать сразу в задаче 9, но это плохой тон)
int is_prime(int n) {
    // TODO: реализовать
}

// Задача 9 - Среднее арифметическое простых чисел в интервале
double average_primes_in_interval(int a, int b) {
    // TODO: реализовать
}

// Задача 10 - Кратные числа в интервале
int count_multiples(int start, int end, int k) {
    // TODO: реализовать
}

// Задача 11 - Високосный год
int is_leap_year(int year) {
    // TODO: реализовать
}

// Задача 12 - Сезон по номеру месяца
const char* season_by_month(int month) {
    // TODO: реализовать
}

// Задача 13 - День недели
const char* day_of_week(int day_num) {
    // TODO: реализовать
}

// Задача 14 - Подсчёт цифр в числе
int count_digits(int n) {
    // TODO: реализовать
}

// Задача 15 - Реверс числа
int reverse_number(int n) {
    // TODO: реализовать
}
`;
