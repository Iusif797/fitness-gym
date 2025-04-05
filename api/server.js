const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const workoutRoutes = require("./routes/workouts");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fitness-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Маршруты
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);

// Обработка статических файлов
app.use("/images", express.static("public/images"));

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Что-то пошло не так!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
