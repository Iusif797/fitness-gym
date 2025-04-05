// netlify/functions/api.js
const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("../../server/routes/userRoutes");
const workoutRoutes = require("../../server/routes/workoutRoutes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключаемся к базе данных
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Маршруты
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);

// Базовый маршрут
app.get("/api", (req, res) => {
  res.json({ message: "Fitness API работает успешно!" });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Ошибка сервера" });
});

// Экспорт функции serverless
module.exports.handler = serverless(app);
