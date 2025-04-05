const express = require("express");
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} = require("../controllers/workouts");

const router = express.Router();

const { protect } = require("../middleware/auth");

// Защищаем все маршруты тренировок
router.use(protect);

// Маршруты для работы со всеми тренировками
router.route("/").get(getWorkouts).post(createWorkout);

// Маршруты для работы с конкретной тренировкой
router.route("/:id").get(getWorkout).put(updateWorkout).delete(deleteWorkout);

module.exports = router;
