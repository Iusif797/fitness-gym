const Workout = require("../models/Workout");
const User = require("../models/User");

// @desc      Получить все тренировки пользователя
// @route     GET /api/workouts
// @access    Private
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort("-date");

    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (err) {
    console.error("Error getting workouts:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка при получении тренировок",
    });
  }
};

// @desc      Получить одну тренировку
// @route     GET /api/workouts/:id
// @access    Private
exports.getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Тренировка не найдена",
      });
    }

    // Проверяем, принадлежит ли тренировка пользователю
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "У вас нет доступа к этой тренировке",
      });
    }

    res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (err) {
    console.error("Error getting workout:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка при получении тренировки",
    });
  }
};

// @desc      Создать новую тренировку
// @route     POST /api/workouts
// @access    Private
exports.createWorkout = async (req, res) => {
  try {
    // Добавляем пользователя к данным тренировки
    req.body.user = req.user.id;

    const workout = await Workout.create(req.body);

    res.status(201).json({
      success: true,
      data: workout,
    });
  } catch (err) {
    console.error("Error creating workout:", err);

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
      message: "Ошибка при создании тренировки",
    });
  }
};

// @desc      Обновить тренировку
// @route     PUT /api/workouts/:id
// @access    Private
exports.updateWorkout = async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Тренировка не найдена",
      });
    }

    // Проверяем, принадлежит ли тренировка пользователю
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "У вас нет доступа к этой тренировке",
      });
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (err) {
    console.error("Error updating workout:", err);

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
      message: "Ошибка при обновлении тренировки",
    });
  }
};

// @desc      Удалить тренировку
// @route     DELETE /api/workouts/:id
// @access    Private
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Тренировка не найдена",
      });
    }

    // Проверяем, принадлежит ли тренировка пользователю
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "У вас нет доступа к этой тренировке",
      });
    }

    await workout.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error("Error deleting workout:", err);
    res.status(500).json({
      success: false,
      message: "Ошибка при удалении тренировки",
    });
  }
};
