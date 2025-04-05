const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Регистрация
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверка существования пользователя
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    // Создание нового пользователя
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

    // Создание токена
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "24h",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Вход
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }

    // Создание токена
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
