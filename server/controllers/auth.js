const User = require("../models/User");

// @desc    Регистрация пользователя
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Пользователь с таким email уже существует",
      });
    }

    // Создаем пользователя
    const user = await User.create({
      name,
      email,
      password,
    });

    // Отправляем токен
    sendTokenResponse(user, 201, res, "Пользователь успешно зарегистрирован");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка при регистрации пользователя",
    });
  }
};

// @desc    Вход пользователя
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Проверяем наличие email и пароля
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Введите email и пароль",
    });
  }

  try {
    // Проверяем, существует ли пользователь
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Неверные учетные данные",
      });
    }

    // Проверяем, совпадает ли пароль
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Неверные учетные данные",
      });
    }

    // Отправляем токен
    sendTokenResponse(user, 200, res, "Вход выполнен успешно");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка при входе в систему",
    });
  }
};

// @desc    Выход пользователя / очистка cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Выход выполнен успешно",
    data: {},
  });
};

// @desc    Получить данные текущего пользователя
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка при получении данных пользователя",
    });
  }
};

// @desc    Обновить данные пользователя
// @route   PUT /api/auth/me
// @access  Private
exports.updateMe = async (req, res) => {
  try {
    // Фильтруем поля, которые можно обновить
    const fieldsToUpdate = {};

    if (req.body.name) fieldsToUpdate.name = req.body.name;
    if (req.body.email) fieldsToUpdate.email = req.body.email;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка при обновлении данных пользователя",
    });
  }
};

// @desc    Обновить пароль пользователя
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Пожалуйста, укажите текущий и новый пароли",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    // Проверка текущего пароля
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Текущий пароль неверен",
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Пароль успешно обновлен");
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка при обновлении пароля",
    });
  }
};

// Вспомогательная функция для отправки токена в ответе
const sendTokenResponse = (user, statusCode, res, message) => {
  // Создаем токен
  const token = user.getSignedJwtToken();

  // Исключаем пароль из ответа
  const userData = user.toObject();
  delete userData.password;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: userData,
  });
};
