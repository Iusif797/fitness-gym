const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Загрузка переменных окружения
dotenv.config();

// Проверяем переменные окружения для MongoDB
if (!process.env.MONGODB_URI) {
  console.warn("ВНИМАНИЕ: Переменная окружения MONGODB_URI не найдена");
  // Устанавливаем значение MongoDB Atlas для проекта
  process.env.MONGODB_URI =
    "mongodb+srv://fytness-gym:13579@fitness-gym.d4t5mhn.mongodb.net/?retryWrites=true&w=majority&appName=fitness-gym";
}

// Проверяем переменные окружения для JWT
if (!process.env.JWT_SECRET) {
  console.warn("ВНИМАНИЕ: Переменная окружения JWT_SECRET не найдена");
  // Устанавливаем запасное значение для разработки
  process.env.JWT_SECRET = "fytness-gym-secret-key-2024";
}

// Логируем информацию о подключении (без пароля)
const connectionString = process.env.MONGODB_URI;
console.log(
  `Подключение к MongoDB: ${connectionString.replace(
    /\/\/([^:]+):([^@]+)@/,
    "//USER:PASSWORD@"
  )}`
);

// Подключение к базе данных
connectDB();

// Импорт маршрутов
const auth = require("./routes/auth");
const workouts = require("./routes/workouts");
const settings = require("./routes/settings");

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Разрешаем все домены
    credentials: true,
  })
);
app.use(express.json()); // Для парсинга JSON тел запросов

// Монтирование маршрутов
app.use("/api/auth", auth);
app.use("/api/workouts", workouts);
app.use("/api/settings", settings);

// Основной маршрут API (проверка работы)
app.get("/api", (req, res) => {
  res.json({
    message: "Fitness Tracker API работает!",
    environment: process.env.NODE_ENV || "development",
    mongodb: process.env.MONGODB_URI ? "Настроено" : "Не настроено",
    jwt: process.env.JWT_SECRET ? "Настроено" : "Не настроено",
  });
});

// Обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Произошла ошибка на сервере",
    error: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

// Обработка невалидных маршрутов
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Маршрут не найден",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 5000;

// Только запускаем сервер если это не Vercel (там запуск происходит автоматически)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Добавляем экспорт app для Vercel
module.exports = app;
