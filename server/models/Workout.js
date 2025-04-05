const mongoose = require("mongoose");

// Схема для одного подхода
const ExerciseSetSchema = new mongoose.Schema(
  {
    reps: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      default: null,
    },
    duration: {
      type: Number, // в секундах
      default: null,
    },
  },
  { _id: false }
); // Не создаем _id для подходов

// Схема для выполненного упражнения
const PerformedExerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: String, // ID из констант фронтенда (или ссылка на модель Exercise, если она будет)
      required: true,
    },
    exerciseName: {
      type: String, // Дублируем имя для удобства отображения
      required: true,
    },
    sets: {
      type: [ExerciseSetSchema],
      required: true,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String, // Например, 'strength', 'weightlifting', 'bodyweight'
    required: [true, "Please add a workout type"],
    enum: ["strength", "weightlifting", "bodyweight"], // Основываясь на обновленных типах
  },
  duration: {
    type: Number, // Общая длительность в минутах
    required: [true, "Please add a duration"],
  },
  calories: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: null,
  },
  equipment: {
    type: [String],
    default: [],
  },
  exercises: {
    type: [PerformedExerciseSchema],
    default: [], // Если тип тренировки не подразумевает упражнений (хотя у нас такие убраны)
  },
});

module.exports = mongoose.model("Workout", WorkoutSchema);
