/**
 * Модуль с константами для упражнений.
 */

/**
 * Список доступных упражнений.
 * @typedef {Object} ExerciseInfo
 * @property {string} id - Уникальный идентификатор упражнения.
 * @property {string} name - Название упражнения.
 * @property {('strength' | 'weightlifting' | 'bodyweight')[]} types - Типы тренировок, к которым относится упражнение.
 * @property {boolean} needsWeight - Требуется ли указание веса.
 */

/**
 * @type {ExerciseInfo[]}
 */
export const EXERCISES_LIST = [
  // Силовые / Тяжелая атлетика
  {
    id: "bench_press",
    name: "Жим лежа",
    types: ["strength", "weightlifting"],
    needsWeight: true,
  },
  {
    id: "squat",
    name: "Приседания со штангой",
    types: ["strength", "weightlifting"],
    needsWeight: true,
  },
  {
    id: "deadlift",
    name: "Становая тяга",
    types: ["strength", "weightlifting"],
    needsWeight: true,
  },
  {
    id: "overhead_press",
    name: "Жим стоя",
    types: ["strength", "weightlifting"],
    needsWeight: true,
  },
  {
    id: "barbell_row",
    name: "Тяга штанги в наклоне",
    types: ["strength", "weightlifting"],
    needsWeight: true,
  },
  {
    id: "dumbbell_press",
    name: "Жим гантелей лежа",
    types: ["strength"],
    needsWeight: true,
  },
  {
    id: "dumbbell_row",
    name: "Тяга гантели в наклоне",
    types: ["strength"],
    needsWeight: true,
  },
  {
    id: "lat_pulldown",
    name: "Тяга верхнего блока",
    types: ["strength"],
    needsWeight: true,
  },
  {
    id: "leg_press",
    name: "Жим ногами",
    types: ["strength"],
    needsWeight: true,
  },
  {
    id: "bicep_curl",
    name: "Подъем на бицепс",
    types: ["strength"],
    needsWeight: true,
  },
  {
    id: "tricep_extension",
    name: "Разгибание на трицепс",
    types: ["strength"],
    needsWeight: true,
  },

  // С весом тела
  {
    id: "pull_up",
    name: "Подтягивания",
    types: ["bodyweight", "strength"],
    needsWeight: false,
  },
  {
    id: "push_up",
    name: "Отжимания",
    types: ["bodyweight", "strength"],
    needsWeight: false,
  },
  {
    id: "dip",
    name: "Отжимания на брусьях",
    types: ["bodyweight", "strength"],
    needsWeight: false,
  },
  {
    id: "bodyweight_squat",
    name: "Приседания с весом тела",
    types: ["bodyweight"],
    needsWeight: false,
  },
  { id: "lunge", name: "Выпады", types: ["bodyweight"], needsWeight: false },
  { id: "plank", name: "Планка", types: ["bodyweight"], needsWeight: false }, // needsWeight=false, но можно добавить поле duration
];

/**
 * Структура одного подхода.
 * @typedef {Object} ExerciseSet
 * @property {number} reps - Количество повторений.
 * @property {number | null} weight - Используемый вес (null, если не применимо).
 * @property {number | null} duration - Длительность (для статических упражнений, например, планки).
 */

/**
 * Структура выполненного упражнения в рамках тренировки.
 * @typedef {Object} PerformedExercise
 * @property {string} exerciseId - ID упражнения из EXERCISES_LIST.
 * @property {ExerciseSet[]} sets - Список выполненных подходов.
 * @property {string | null} notes - Заметки к конкретному упражнению.
 */
