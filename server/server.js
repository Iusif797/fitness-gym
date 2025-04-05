const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Загрузка переменных окружения
dotenv.config();

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
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://fitness-five-xi.vercel.app",
            "https://fitness-gym.vercel.app",
            "https://fitness-gym-iusif797.vercel.app",
          ]
        : "http://localhost:3000",
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
  res.json({ message: "Fitness Tracker API работает!" });
});

// Обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Произошла ошибка на сервере",
  });
});

// Обработка невалидных маршрутов
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Маршрут не найден",
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
