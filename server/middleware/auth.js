const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Защита маршрутов
exports.protect = async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовке Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Получаем токен из заголовка
    token = req.headers.authorization.split(" ")[1];
  }

  // Убедимся, что токен существует
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Нет доступа к данному ресурсу",
    });
  }

  try {
    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Добавляем пользователя к запросу
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({
      success: false,
      message: "Нет доступа к данному ресурсу",
    });
  }
};

module.exports = { protect };
