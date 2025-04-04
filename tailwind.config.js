/** @type {import('tailwindcss').Config} */
export default {
  content: [  
    "./index.html", // путь к HTML-файлам
    "./src/**/*.{js,jsx,ts,tsx}", // пути к файлам в src
  ],
  theme: {
    extend: {
    }, // здесь можно добавить кастомные настройки темы
  },
  plugins: [],
}
