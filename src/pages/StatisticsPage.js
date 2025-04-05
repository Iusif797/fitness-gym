import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { WorkoutContext } from "../context/WorkoutContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import {
  FiChevronLeft,
  FiClock,
  FiZap,
  FiActivity,
  FiCalendar,
  FiBarChart2,
  FiTrendingUp,
  FiFilter,
  FiUser,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import {
  WORKOUT_COLORS,
  WORKOUT_TYPES,
  WORKOUT_LABELS,
} from "../types/workout";

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

// Устанавливаем глобальные настройки для графиков
ChartJS.defaults.color = "#94a1b2";
ChartJS.defaults.borderColor = "rgba(255, 255, 255, 0.1)";

const StatisticsPage = () => {
  const { workouts } = useContext(WorkoutContext);
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("all"); // 'week', 'month', 'year', 'all'

  // Отфильтрованные по типу тренировки
  const filteredWorkouts =
    filterType === "all"
      ? workouts
      : workouts.filter((workout) => workout.type === filterType);

  // Отфильтрованные по дате
  const getFilteredByDate = () => {
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case "week":
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return filteredWorkouts;
    }

    return filteredWorkouts.filter(
      (workout) =>
        new Date(workout.date) >= startDate && new Date(workout.date) <= now
    );
  };

  const dateFilteredWorkouts = getFilteredByDate();

  // Сортировка тренировок по дате (от новых к старым)
  const sortedWorkouts = [...dateFilteredWorkouts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Группировка тренировок по месяцам для графика
  const getMonthlyWorkoutsData = () => {
    const months = [];
    const calories = [];
    const durations = [];

    // Последние 6 месяцев
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = `${date.toLocaleString("ru-RU", {
        month: "short",
      })} ${date.getFullYear()}`;

      months.push(monthYear);

      const monthWorkouts = workouts.filter((workout) => {
        const workoutDate = new Date(workout.date);
        return (
          workoutDate.getMonth() === date.getMonth() &&
          workoutDate.getFullYear() === date.getFullYear()
        );
      });

      calories.push(monthWorkouts.reduce((sum, w) => sum + w.calories, 0));
      durations.push(monthWorkouts.reduce((sum, w) => sum + w.duration, 0));
    }

    return {
      labels: months,
      datasets: [
        {
          label: "Калории",
          data: calories,
          borderColor: WORKOUT_COLORS.cardio || "#6c63ff",
          backgroundColor: `${WORKOUT_COLORS.cardio || "#6c63ff"}20`,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#fff",
          pointBorderColor: WORKOUT_COLORS.cardio || "#6c63ff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Длительность (мин)",
          data: durations,
          borderColor: WORKOUT_COLORS.strength || "#ff6584",
          backgroundColor: `${WORKOUT_COLORS.strength || "#ff6584"}20`,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#fff",
          pointBorderColor: WORKOUT_COLORS.strength || "#ff6584",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  // Данные для пончикового графика по типам тренировок
  const getWorkoutTypesData = () => {
    // Подсчитываем количество каждого типа тренировки
    const counts = {};
    workouts.forEach((workout) => {
      counts[workout.type] = (counts[workout.type] || 0) + 1;
    });

    // Преобразуем в формат для графика
    return {
      labels: WORKOUT_TYPES.map((type) => WORKOUT_LABELS[type]),
      datasets: [
        {
          data: WORKOUT_TYPES.map((type) => counts[type] || 0),
          backgroundColor: WORKOUT_TYPES.map((type) => WORKOUT_COLORS[type]),
          borderColor: "rgba(255, 255, 255, 0.5)",
          borderWidth: 2,
          hoverOffset: 15,
        },
      ],
    };
  };

  // Опции для графиков
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 14, 23, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        bodySpacing: 10,
        padding: 15,
        boxWidth: 12,
        boxHeight: 12,
        boxPadding: 5,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        cornerRadius: 10,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        displayColors: true,
        usePointStyle: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 14, 23, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        bodySpacing: 10,
        padding: 15,
        boxWidth: 12,
        boxHeight: 12,
        boxPadding: 5,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        cornerRadius: 10,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        displayColors: true,
        usePointStyle: true,
      },
    },
  };

  // Компонент для иконки типа тренировки
  const WorkoutTypeIcon = ({ type }) => {
    switch (type) {
      case "strength":
      case "weightlifting":
        return <FiActivity />;
      case "cardio":
      case "crossfit":
      case "hiit":
        return <FiActivity />;
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
        <h1>Статистика тренировок</h1>
        <div className="flex-row">
          <button
            className="btn btn-outline mr-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            <span className="btn-text">Фильтры</span>
          </button>
          <Link to="/" className="btn btn-outline">
            <FiChevronLeft />
            <span className="btn-text">На главную</span>
          </Link>
        </div>
      </div>

      {/* Панель фильтров */}
      {showFilters && (
        <div className="paper fade-in mb-4">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="form-label">Тип тренировки</label>
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Все типы</option>
                {WORKOUT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {WORKOUT_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">Период</label>
              <select
                className="form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all">За все время</option>
                <option value="week">За последнюю неделю</option>
                <option value="month">За последний месяц</option>
                <option value="year">За последний год</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Общая статистика */}
      <div className="paper">
        <h2 className="section-title mb-4">Общая статистика</h2>

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{dateFilteredWorkouts.length}</div>
            <div className="stat-label">
              <FiBarChart2 /> Тренировок
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-value">
              {dateFilteredWorkouts.reduce((sum, w) => sum + w.duration, 0)} мин
            </div>
            <div className="stat-label">
              <FiClock /> Общее время
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-value">
              {dateFilteredWorkouts.reduce((sum, w) => sum + w.calories, 0)}{" "}
              ккал
            </div>
            <div className="stat-label">
              <FiZap /> Сожжено калорий
            </div>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid">
        {/* График активности по месяцам */}
        <div className="paper">
          <h2 className="section-title mb-4">
            <FiTrendingUp /> Активность по месяцам
          </h2>
          <div className="chart-container">
            <Line data={getMonthlyWorkoutsData()} options={lineChartOptions} />
          </div>
        </div>

        {/* Распределение по типам тренировок */}
        <div className="paper">
          <h2 className="section-title mb-4">
            <FiPieChart /> Типы тренировок
          </h2>
          <div className="chart-container">
            <Doughnut data={getWorkoutTypesData()} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Список тренировок */}
      <div className="paper">
        <h2 className="section-title mb-4">
          <FiList />{" "}
          {filteredWorkouts.length > 0
            ? "История тренировок"
            : "Тренировок не найдено"}
        </h2>

        {/* Поиск */}
        <div className="search-bar mb-4">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Поиск тренировок..."
          />
        </div>

        {sortedWorkouts.length > 0 ? (
          <div className="workout-list">
            {sortedWorkouts.map((workout) => (
              <div className="workout-list-item" key={workout.id}>
                <div className="workout-list-item-left">
                  <div
                    className="workout-type-icon"
                    style={{ backgroundColor: WORKOUT_COLORS[workout.type] }}
                  >
                    <WorkoutTypeIcon type={workout.type} />
                  </div>
                </div>

                <div className="workout-list-item-content">
                  <div className="workout-list-item-header">
                    <h3>{WORKOUT_LABELS[workout.type]}</h3>
                    <span className="workout-date">
                      <FiCalendar />{" "}
                      {new Date(workout.date).toLocaleDateString("ru-RU")}
                    </span>
                  </div>

                  <div className="workout-list-item-details">
                    <div className="workout-stat">
                      <FiClock /> {workout.duration} мин
                    </div>
                    <div className="workout-stat">
                      <FiZap /> {workout.calories} ккал
                    </div>
                    {workout.equipment && workout.equipment.length > 0 && (
                      <div className="workout-equipment">
                        <FiActivity className="icon" />
                        <span>{workout.equipment.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {workout.notes && (
                    <div className="workout-list-item-notes">
                      {workout.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>
              Тренировок не найдено. Измените фильтры или добавьте новые
              тренировки.
            </p>
            <Link to="/workout" className="btn btn-primary mt-4">
              <FiPlus /> Добавить тренировку
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Иконки для заголовков секций
const FiPieChart = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a10 10 0 0 1 10 10"></path>
    <path d="M12 12 7 4.9"></path>
  </svg>
);

const FiList = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

export default StatisticsPage;
