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
export const WORKOUT_TYPES = [
  "strength",
  "cardio",
  "stretching",
  "crossfit",
  "hiit",
  "weightlifting",
  "bodyweight",
];

/**
 * Названия типов тренировок на русском.
 * @type {Object.<WorkoutType, string>}
 */
export const WORKOUT_LABELS = {
  strength: "Силовая",
  cardio: "Кардио",
  stretching: "Растяжка",
  crossfit: "Кроссфит",
  hiit: "ВИИТ",
  weightlifting: "Тяжелая атлетика",
  bodyweight: "С весом тела",
};

/**
 * Цвета для типов тренировок.
 * @type {Object.<WorkoutType, string>}
 */
export const WORKOUT_COLORS = {
  strength: "#FF6584", // розовый
  cardio: "#6C63FF", // фиолетовый
  stretching: "#00D4FF", // голубой
  crossfit: "#FF9F43", // оранжевый
  hiit: "#F53844", // красный
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
  cardio:
    "Аэробная тренировка для улучшения работы сердечно-сосудистой системы.",
  stretching: "Тренировка для улучшения гибкости и подвижности суставов.",
  crossfit:
    "Высокоинтенсивная тренировка с комбинацией силовых упражнений и кардио.",
  hiit: "Высокоинтенсивный интервальный тренинг - чередование периодов интенсивной работы и отдыха.",
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
  cardio: 8, // ~480 ккал/час
  stretching: 3, // ~180 ккал/час
  crossfit: 10, // ~600 ккал/час
  hiit: 12, // ~720 ккал/час
  weightlifting: 6, // ~360 ккал/час
  bodyweight: 5, // ~300 ккал/час
};

/**
 * Оборудование, которое может использоваться для каждого типа тренировки.
 * @type {Object.<WorkoutType, WorkoutEquipment[]>}
 */
export const WORKOUT_EQUIPMENT = {
  strength: ["гантели", "штанга", "тренажер", "гиря", "скамья"],
  cardio: [
    "беговая дорожка",
    "велотренажер",
    "эллиптический тренажер",
    "скакалка",
  ],
  stretching: ["коврик", "эспандер", "ролик"],
  crossfit: ["штанга", "гантели", "скакалка", "гиря", "турник", "кольца"],
  hiit: ["скакалка", "гантели", "коврик", "степ-платформа"],
  weightlifting: ["штанга", "гантели", "гиря", "скамья", "силовая рама"],
  bodyweight: ["турник", "брусья", "кольца", "коврик"],
};
