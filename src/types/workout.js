/**
 * Модуль с константами и типами для тренировок.
 *
 * @module workout
 */

/**
 * Типы тренировок.
 *
 * @typedef {'strength' | 'cardio' | 'stretching' | 'crossfit' | 'hiit' | 'weightlifting' | 'bodyweight'} WorkoutType
 */

/**
 * Оборудование для тренировок.
 *
 * @typedef {'гантели' | 'штанга' | 'тренажер' | 'скакалка' | 'гиря' | 'турник' | 'скамья' | 'мяч'} WorkoutEquipment
 */

/**
 * Настройки пользователя.
 *
 * @typedef {Object} UserSettings
 * @property {string} name - Имя пользователя.
 * @property {string} email - Email пользователя.
 * @property {'dark' | 'light'} theme - Тема интерфейса.
 * @property {'ru' | 'en'} language - Язык интерфейса.
 * @property {'metric' | 'imperial'} units - Система единиц измерения.
 * @property {boolean} notifications - Включены ли уведомления.
 * @property {boolean} showCalories - Показывать ли калории.
 * @property {boolean} showTimer - Показывать ли таймер.
 */

/**
 * Типы тренировок (идентификаторы).
 * @type {WorkoutType[]}
 */
export const WORKOUT_TYPES = ["strength", "weightlifting", "bodyweight"];

/**
 * Названия типов тренировок на русском.
 * @type {Object.<WorkoutType, string>}
 */
export const WORKOUT_LABELS = {
  strength: "Силовая",
  weightlifting: "Тяжелая атлетика",
  bodyweight: "С весом тела",
};

/**
 * Цвета для типов тренировок.
 * @type {Object.<WorkoutType, string>}
 */
export const WORKOUT_COLORS = {
  strength: "#FF6584", // розовый
  weightlifting: "#5F27CD", // темно-фиолетовый
  bodyweight: "#10AC84", // зеленый
};

/**
 * Описания типов тренировок.
 * @type {Object.<WorkoutType, string>}
 */
export const WORKOUT_DESCRIPTIONS = {
  strength:
    "Тренировка для увеличения силы и мышечной массы с использованием отягощений.",
  weightlifting:
    "Тренировка со свободными весами для развития силы и мощности.",
  bodyweight: "Тренировка с использованием собственного веса тела.",
};

/**
 * Среднее количество калорий, сжигаемых за минуту тренировки.
 * @type {Object.<WorkoutType, number>}
 */
export const CALORIES_PER_MINUTE = {
  strength: 5, // ~300 ккал/час
  weightlifting: 6, // ~360 ккал/час
  bodyweight: 5, // ~300 ккал/час
};

/**
 * Оборудование, которое может использоваться для каждого типа тренировки.
 * @type {Object.<WorkoutType, WorkoutEquipment[]>}
 */
export const WORKOUT_EQUIPMENT = {
  strength: ["гантели", "штанга", "тренажер", "гиря", "скамья"],
  weightlifting: ["штанга", "гантели", "гиря", "скамья", "силовая рама"],
  bodyweight: ["турник", "брусья", "кольца", "коврик"],
};
