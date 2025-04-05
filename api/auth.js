const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/User");

// Регистрация
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверяем, существует ли пользователь
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    // Создаем нового пользователя
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      settings: {
        theme: "light",
        language: "ru",
      },
    });

    await user.save();

    // Создаем токен
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Вход
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверяем пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }

    // Проверяем пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }

    // Создаем токен
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение данных пользователя
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Нет токена авторизации" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({ message: "Токен недействителен" });
  }
});

// Обновление настроек пользователя
router.put("/settings", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Нет токена авторизации" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    user.settings = { ...user.settings, ...req.body };
    await user.save();

    res.json({ settings: user.settings });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
