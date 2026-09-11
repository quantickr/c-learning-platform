import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Изучение основ C | Интерактивный курс",
  description: "Интерактивный курс по основам синтаксиса языка C с автоматической проверкой кода",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
