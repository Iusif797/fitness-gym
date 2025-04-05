const User = require("../models/User");

// @desc    Получить настройки пользователя
// @route   GET /api/settings
// @access  Private
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    res.status(200).json({
      success: true,
      data: user.settings,
    });
  } catch (err) {
    console.error("Error getting settings:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка при получении настроек",
    });
  }
};

// @desc    Обновить настройки пользователя
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    const { theme, language, units, showCalories, showTimer } = req.body;

    // Создаем объект с только валидными полями
    const settingsToUpdate = {};

    if (theme) settingsToUpdate["settings.theme"] = theme;
    if (language) settingsToUpdate["settings.language"] = language;
    if (units) settingsToUpdate["settings.units"] = units;
    if (showCalories !== undefined)
      settingsToUpdate["settings.showCalories"] = showCalories;
    if (showTimer !== undefined)
      settingsToUpdate["settings.showTimer"] = showTimer;

    // Если нет полей для обновления, возвращаем ошибку
    if (Object.keys(settingsToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Не указаны поля для обновления",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: settingsToUpdate },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    res.status(200).json({
      success: true,
      data: user.settings,
    });
  } catch (err) {
    console.error("Error updating settings:", err);

    // Обработка ошибок валидации
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Ошибка при обновлении настроек",
    });
  }
};
