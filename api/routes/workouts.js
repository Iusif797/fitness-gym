const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Временное хранилище для тренировок (замените на модель MongoDB)
let workouts = [];

// Получить все тренировки пользователя
router.get("/", auth, (req, res) => {
  const userWorkouts = workouts.filter((w) => w.userId === req.user.id);
  res.json(userWorkouts);
});

// Создать новую тренировку
router.post("/", auth, (req, res) => {
  const { title, exercises, date } = req.body;
  const workout = {
    id: Date.now().toString(),
    userId: req.user.id,
    title,
    exercises,
    date,
    createdAt: new Date(),
  };
  workouts.push(workout);
  res.status(201).json(workout);
});

// Обновить тренировку
router.put("/:id", auth, (req, res) => {
  const { id } = req.params;
  const { title, exercises, date } = req.body;

  const workoutIndex = workouts.findIndex(
    (w) => w.id === id && w.userId === req.user.id
  );
  if (workoutIndex === -1) {
    return res.status(404).json({ message: "Тренировка не найдена" });
  }

  workouts[workoutIndex] = {
    ...workouts[workoutIndex],
    title,
    exercises,
    date,
    updatedAt: new Date(),
  };

  res.json(workouts[workoutIndex]);
});

// Удалить тренировку
router.delete("/:id", auth, (req, res) => {
  const { id } = req.params;
  const workoutIndex = workouts.findIndex(
    (w) => w.id === id && w.userId === req.user.id
  );

  if (workoutIndex === -1) {
    return res.status(404).json({ message: "Тренировка не найдена" });
  }

  workouts = workouts.filter((w) => w.id !== id);
  res.status(204).send();
});

module.exports = router;
