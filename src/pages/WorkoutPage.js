import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { useTranslation } from "react-i18next";
import {
  FiChevronLeft,
  FiClock,
  FiZap,
  FiMessageSquare,
  FiUser,
  FiActivity,
  FiFolderPlus,
  FiPlusCircle,
  FiCheck,
  FiAward,
  FiHeart,
  FiSun,
  FiDroplet,
  FiTrendingUp,
  FiType,
  FiFileText,
  FiX,
  FiBarChart2,
} from "react-icons/fi";
import Timer from "../components/Timer";
import {
  WORKOUT_TYPES,
  WORKOUT_LABELS,
  WORKOUT_EQUIPMENT,
  WORKOUT_COLORS,
  CALORIES_PER_MINUTE,
} from "../types/workout";
import "../styles/WorkoutPage.css";

const WorkoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addWorkout } = useWorkout();
  const { t, i18n } = useTranslation();

  // Состояния для формы
  const [selectedType, setSelectedType] = useState("");
  const [duration, setDuration] = useState(30);
  const [calories, setCalories] = useState(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [useTimer, setUseTimer] = useState(false);
  const [showEquipment, setShowEquipment] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Получаем иконку для типа тренировки
  const getWorkoutIcon = (type) => {
    switch (type) {
      case "strength":
        return <FiTrendingUp className="workout-type-icon-svg" />;
      case "cardio":
        return <FiHeart className="workout-type-icon-svg" />;
      case "flexibility":
        return <FiSun className="workout-type-icon-svg" />;
      case "bodyweight":
        return <FiUser className="workout-type-icon-svg" />;
      case "hiit":
        return <FiZap className="workout-type-icon-svg" />;
      case "weightlifting":
        return <FiActivity className="workout-type-icon-svg" />;
      case "crossfit":
        return <FiBarChart2 className="workout-type-icon-svg" />;
      default:
        return <FiAward className="workout-type-icon-svg" />;
    }
  };

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

  // Переключение между шагами
  const goToNextStep = () => {
    if (activeStep === 1 && !selectedType) {
      setError(t("workout.selectTypeError"));
      return;
    }

    setError("");
    setActiveStep(activeStep + 1);
  };

  const goToPrevStep = () => {
    setActiveStep(activeStep - 1);
  };

  // Обработчик сохранения тренировки
  const handleSave = () => {
    // Валидация
    if (!selectedType) {
      setError(t("workout.selectTypeError"));
      return;
    }

    if (duration <= 0) {
      setError(t("workout.durationRequired"));
      return;
    }

    setIsSubmitting(true);

    // Создаем объект тренировки
    const workout = {
      id: Date.now().toString(),
      type: selectedType,
      name: workoutName || t(`workout.workoutTypes.${selectedType}`),
      duration,
      calories,
      date: new Date().toISOString(),
      notes,
      equipment: selectedEquipment,
    };

    // Добавляем тренировку
    setTimeout(() => {
      addWorkout(workout);
      setIsSubmitting(false);
      navigate("/");
    }, 800); // Искусственная задержка для анимации
  };

  // Получаем переведенное название типа тренировки
  const getLocalizedWorkoutLabel = (type) => {
    return t(`workout.workoutTypes.${type}`);
  };

  // Рендеринг содержимого в зависимости от шага
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="workout-step workout-step-1 fade-in">
            <h2 className="step-title">
              <span className="step-number">1</span> {t("workout.selectType")}
            </h2>

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
                  style={{
                    borderColor:
                      selectedType === type
                        ? WORKOUT_COLORS[type]
                        : "transparent",
                    boxShadow:
                      selectedType === type
                        ? `0 10px 25px -5px ${WORKOUT_COLORS[type]}40`
                        : "0 5px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="workout-type-icon"
                    style={{
                      backgroundColor: WORKOUT_COLORS[type],
                    }}
                  >
                    {getWorkoutIcon(type)}
                  </div>
                  <div className="workout-type-name">
                    {getLocalizedWorkoutLabel(type)}
                  </div>
                </div>
              ))}
            </div>

            <div className="step-navigation">
              <button
                className="btn btn-outline btn-back"
                onClick={() => navigate("/")}
              >
                <FiChevronLeft />
                {t("common.cancel")}
              </button>
              <button
                className="btn btn-primary btn-next"
                onClick={goToNextStep}
                disabled={!selectedType}
              >
                {t("workout.next")}
                <FiCheck />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="workout-step workout-step-2 fade-in">
            <h2 className="step-title">
              <span className="step-number">2</span>{" "}
              {t("workout.configureWorkout")}
            </h2>

            <div className="form-row">
              <div className="form-group workout-name-group">
                <label className="form-label">
                  <FiType />
                  {t("workout.name")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder={`${getLocalizedWorkoutLabel(selectedType)} ${t(
                    "workout.workout"
                  ).toLowerCase()}`}
                />
              </div>
            </div>

            {/* Переключатель таймера */}
            <div className="form-row">
              <div className="form-group timer-toggle-group">
                <label className="form-label">
                  {t("workout.workoutTimer")}
                </label>
                <button
                  className={`btn ${useTimer ? "btn-primary" : "btn-outline"}`}
                  onClick={toggleTimer}
                >
                  {useTimer ? <FiX /> : <FiClock />}
                  {useTimer ? t("workout.disableTimer") : t("workout.useTimer")}
                </button>
              </div>
            </div>

            {/* Компонент таймера, отображается при активации */}
            {useTimer && <Timer onFinish={handleTimerFinish} />}

            {/* Длительность тренировки */}
            {!useTimer && (
              <div className="form-row">
                <div className="form-group duration-group">
                  <label className="form-label">
                    <FiClock />
                    {t("workout.duration")} ({t("workout.minutes")})
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

                <div className="form-group calories-group">
                  <label className="form-label">
                    <FiZap />
                    {t("workout.calories")}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={calories}
                    onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Оборудование, если доступно для типа тренировки */}
            {selectedType &&
              WORKOUT_EQUIPMENT &&
              WORKOUT_EQUIPMENT[selectedType] && (
                <div className="form-group">
                  <label className="form-label">{t("workout.equipment")}</label>
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

            <div className="step-navigation">
              <button
                className="btn btn-outline btn-back"
                onClick={goToPrevStep}
              >
                <FiChevronLeft />
                {t("workout.back")}
              </button>
              <button
                className="btn btn-primary btn-next"
                onClick={goToNextStep}
              >
                {t("workout.next")}
                <FiCheck />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="workout-step workout-step-3 fade-in">
            <h2 className="step-title">
              <span className="step-number">3</span>{" "}
              {t("workout.addNotesAndSave")}
            </h2>

            <div className="workout-summary">
              <div
                className="summary-header"
                style={{
                  backgroundColor: WORKOUT_COLORS[selectedType],
                  backgroundImage: `linear-gradient(135deg, ${WORKOUT_COLORS[selectedType]}, ${WORKOUT_COLORS[selectedType]}bb)`,
                }}
              >
                <div className="summary-type-icon">
                  {getWorkoutIcon(selectedType)}
                </div>
                <div className="summary-title">
                  <h3>
                    {workoutName || getLocalizedWorkoutLabel(selectedType)}
                  </h3>
                  <div className="summary-stats">
                    <span>
                      <FiClock /> {duration} {t("workout.minutes")}
                    </span>
                    <span>
                      <FiZap /> {calories} {t("workout.kcal")}
                    </span>
                  </div>
                </div>
              </div>

              {selectedEquipment.length > 0 && (
                <div className="summary-equipment">
                  <h4>{t("workout.equipment")}:</h4>
                  <div className="summary-equipment-list">
                    {selectedEquipment.map((equipment) => (
                      <span key={equipment} className="equipment-tag">
                        {equipment}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Примечания */}
            <div className="form-group notes-group">
              <label className="form-label">
                <FiFileText />
                {t("workout.notes")}
              </label>
              <textarea
                className="form-control form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("workout.notesPlaceholder")}
                rows={5}
              />
            </div>

            <div className="step-navigation">
              <button
                className="btn btn-outline btn-back"
                onClick={goToPrevStep}
              >
                <FiChevronLeft />
                {t("workout.back")}
              </button>
              <button
                className={`btn btn-primary btn-save ${
                  isSubmitting ? "loading" : ""
                }`}
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="btn-loader"></span>
                ) : (
                  <>
                    <FiFolderPlus />
                    {t("workout.saveWorkout")}
                  </>
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="workout-page container fade-in">
      <div className="page-header">
        <h1>{t("workout.newWorkout")}</h1>
        <div className="progress-indicator">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`progress-step ${
                activeStep === step ? "active" : ""
              } ${activeStep > step ? "completed" : ""}`}
              onClick={() => activeStep > step && setActiveStep(step)}
            >
              {activeStep > step ? <FiCheck /> : step}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <FiX className="alert-icon" />
          {error}
        </div>
      )}

      <div className="workout-form-container">{renderStepContent()}</div>

      <div className="copyright-notice">Developed by Iusif Mamedov</div>
    </div>
  );
};

export default WorkoutPage;
