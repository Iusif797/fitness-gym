import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { WorkoutContext } from "../context/WorkoutContext";
import Timer from "../components/Timer";
import {
  WORKOUT_TYPES,
  WORKOUT_LABELS,
  WORKOUT_COLORS,
  CALORIES_PER_MINUTE,
  WORKOUT_EQUIPMENT,
} from "../types/workout";
import {
  FiClock,
  FiZap,
  FiMessageSquare,
  FiChevronLeft,
  FiFolderPlus,
  FiActivity,
  FiUser,
} from "react-icons/fi";

const WorkoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addWorkout } = useContext(WorkoutContext);
  const [notes, setNotes] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [duration, setDuration] = useState(0);
  const [calories, setCalories] = useState(0);
  const [useTimer, setUseTimer] = useState(false);
  const [showEquipment, setShowEquipment] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [error, setError] = useState("");

  // Проверяем, передан ли тип тренировки через параметры URL или state
  useEffect(() => {
    // Парсим параметры URL
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type");

    // Проверяем наличие типа в параметрах или в state
    const newType = typeParam || (location.state && location.state.type) || "";

    // Устанавливаем тип, если он валиден
    if (newType && WORKOUT_TYPES.includes(newType)) {
      setSelectedType(newType);
      // Предварительно рассчитываем калории для выбранного типа
      calculateCalories(30, newType);

      // Показываем экипировку, если она доступна для данного типа
      setShowEquipment(
        WORKOUT_EQUIPMENT &&
          WORKOUT_EQUIPMENT[newType] &&
          WORKOUT_EQUIPMENT[newType].length > 0
      );
    }
  }, [location]);

  // Обновляем калории при изменении длительности или типа
  useEffect(() => {
    if (selectedType && duration > 0) {
      calculateCalories(duration, selectedType);
    }
  }, [duration, selectedType]);

  // Простой расчет калорий на основе типа тренировки и длительности
  const calculateCalories = (mins, type) => {
    if (!type) return;

    // Используем значения из таблицы или стандартное значение
    const caloriesPerMinute =
      CALORIES_PER_MINUTE && CALORIES_PER_MINUTE[type]
        ? CALORIES_PER_MINUTE[type]
        : 5;

    // Рассчитываем калории
    const calculatedCalories = Math.round(mins * caloriesPerMinute);
    setCalories(calculatedCalories);
  };

  // Обработчик изменения длительности тренировки
  const handleDurationChange = (event) => {
    const newDuration = parseInt(event.target.value, 10) || 0;
    setDuration(newDuration);
  };

  // Функция для обработки окончания таймера
  const handleTimerFinish = (seconds) => {
    // Конвертируем секунды в минуты, округляя до ближайшей минуты
    const mins = Math.round(seconds / 60);
    setDuration(mins);
    setUseTimer(false);
  };

  // Обработчик для переключателя таймера
  const toggleTimer = () => {
    setUseTimer(!useTimer);
  };

  // Обработчик переключения оборудования
  const toggleEquipment = (equipment) => {
    if (selectedEquipment.includes(equipment)) {
      setSelectedEquipment(
        selectedEquipment.filter((item) => item !== equipment)
      );
    } else {
      setSelectedEquipment([...selectedEquipment, equipment]);
    }
  };

  // Обработчик сохранения тренировки
  const handleSave = () => {
    // Валидация
    if (!selectedType) {
      setError("Выберите тип тренировки");
      return;
    }

    if (duration <= 0) {
      setError("Укажите длительность тренировки");
      return;
    }

    // Создаем объект тренировки
    const workout = {
      id: Date.now().toString(),
      type: selectedType,
      duration,
      calories,
      date: new Date().toISOString(),
      notes,
      equipment: selectedEquipment,
    };

    // Добавляем тренировку
    addWorkout(workout);
    navigate("/");
  };

  const getWorkoutIcon = (type) => {
    switch (type) {
      case "strength":
      case "weightlifting":
        return <FiActivity />;
      case "cardio":
      case "crossfit":
      case "hiit":
      case "stretching":
        return <FiActivity />;
      case "bodyweight":
        return <FiUser />;
      default:
        return <FiActivity />;
    }
  };

  return (
    <div className="container fade-in">
      <div className="page-title">
        <h1>Новая тренировка</h1>
        <button className="btn btn-outline" onClick={() => navigate("/")}>
          <FiChevronLeft />
          Назад
        </button>
      </div>

      {/* Компонент таймера, отображается при активации */}
      {useTimer && <Timer onFinish={handleTimerFinish} />}

      <div className="paper">
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Выбор типа тренировки */}
        <div className="form-group">
          <label className="form-label">Выберите тип тренировки</label>
          <div className="workout-types-grid">
            {WORKOUT_TYPES.map((type) => (
              <div
                key={type}
                className={`workout-type-card ${
                  selectedType === type ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedType(type);
                  calculateCalories(duration || 30, type);
                  setShowEquipment(
                    WORKOUT_EQUIPMENT &&
                      WORKOUT_EQUIPMENT[type] &&
                      WORKOUT_EQUIPMENT[type].length > 0
                  );
                }}
                style={
                  selectedType === type
                    ? {
                        borderColor: WORKOUT_COLORS[type],
                        transform: "translateY(-5px)",
                      }
                    : {}
                }
              >
                <div
                  className="workout-type-icon"
                  style={{
                    backgroundColor: WORKOUT_COLORS[type],
                    color: "#fff",
                  }}
                >
                  {getWorkoutIcon(type)}
                </div>
                <div className="workout-type-name">{WORKOUT_LABELS[type]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Оборудование, если доступно для типа тренировки */}
        {showEquipment &&
          selectedType &&
          WORKOUT_EQUIPMENT &&
          WORKOUT_EQUIPMENT[selectedType] && (
            <div className="form-group">
              <label className="form-label">Используемое оборудование</label>
              <div className="equipment-options">
                {WORKOUT_EQUIPMENT[selectedType].map((equipment) => (
                  <div
                    key={equipment}
                    className={`equipment-option ${
                      selectedEquipment.includes(equipment) ? "active" : ""
                    }`}
                    onClick={() => toggleEquipment(equipment)}
                  >
                    <FiActivity className="equipment-icon" />
                    <span>{equipment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Переключатель таймера */}
        <div className="form-group">
          <button
            className={`btn ${useTimer ? "btn-secondary" : "btn-outline"}`}
            onClick={toggleTimer}
          >
            <FiClock />
            {useTimer ? "Выключить таймер" : "Использовать таймер"}
          </button>
        </div>

        {/* Длительность тренировки */}
        {!useTimer && (
          <div className="form-group">
            <label className="form-label">
              <FiClock />
              Длительность (минуты)
            </label>
            <input
              type="number"
              className="form-control"
              value={duration}
              onChange={handleDurationChange}
              min="1"
              max="500"
            />
          </div>
        )}

        {/* Калории */}
        <div className="form-group">
          <label className="form-label">
            <FiZap />
            Калории
          </label>
          <input
            type="number"
            className="form-control"
            value={calories}
            onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
            min="0"
          />
          <small className="form-text">
            Расчет калорий производится автоматически на основе типа и
            длительности тренировки
          </small>
        </div>

        {/* Примечания */}
        <div className="form-group">
          <label className="form-label">
            <FiMessageSquare />
            Примечания
          </label>
          <textarea
            className="form-control form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Добавьте заметки о вашей тренировке..."
          />
        </div>

        {/* Кнопка сохранения */}
        <button className="btn btn-primary" onClick={handleSave}>
          <FiFolderPlus />
          Сохранить тренировку
        </button>
      </div>
    </div>
  );
};

export default WorkoutPage;
