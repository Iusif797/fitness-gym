import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { WorkoutContext } from "../context/WorkoutContext";
import {
  WORKOUT_TYPES,
  WORKOUT_COLORS,
  WORKOUT_LABELS,
} from "../types/workout";
import {
  FiPlus,
  FiClock,
  FiZap,
  FiActivity,
  FiBarChart2,
  FiMenu,
  FiX,
  FiSettings,
  FiUser,
  FiInfo,
  FiHeart,
  FiGithub,
  FiMoon,
  FiSun,
  FiLogOut,
  FiHome,
  FiCalendar,
} from "react-icons/fi";

const HomePage = () => {
  const {
    workouts,
    totalStats,
    deleteWorkout,
    userSettings,
    updateUserSettings,
  } = useContext(WorkoutContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkTheme, setDarkTheme] = useState(userSettings.darkTheme);

  // Следим за изменением размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const toggleTheme = () => {
    const newTheme = !darkTheme;
    setDarkTheme(newTheme);
    updateUserSettings({ ...userSettings, darkTheme: newTheme });
  };

  // Компонент бокового меню
  const Sidebar = () => (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>FitTracker</h2>
        <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
          <FiX />
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          <FiUser size={24} />
        </div>
        <div className="user-info">
          <h3>{userSettings.name}</h3>
          <p>{userSettings.email}</p>
        </div>
      </div>

      <div className="sidebar-menu">
        <Link to="/" className="sidebar-menu-item active">
          <FiHome />
          Главная
        </Link>
        <Link to="/workout" className="sidebar-menu-item">
          <FiActivity />
          Добавить тренировку
        </Link>
        <Link to="/statistics" className="sidebar-menu-item">
          <FiBarChart2 />
          Статистика
        </Link>
        <div className="sidebar-menu-item">
          <FiCalendar />
          Календарь
        </div>
        <div className="sidebar-menu-item">
          <FiSettings />
          Настройки
        </div>
        <div className="sidebar-menu-item">
          <FiInfo />О приложении
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {darkTheme ? <FiSun /> : <FiMoon />}
          {darkTheme ? "Светлая тема" : "Темная тема"}
        </button>

        <button className="logout-btn">
          <FiLogOut />
          Выйти
        </button>

        <div className="developer-info">
          <FiHeart />
          Разработано с любовью
          <strong> Iusif Mamedov</strong>
        </div>

        <div className="developer-info">
          <FiGithub />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );

  // Основное содержимое страницы
  const MainContent = () => (
    <div className="main-content container">
      <div className="page-title">
        <h1>Фитнес трекер</h1>
        <Link to="/workout" className="btn btn-primary">
          <FiPlus />
          <span className="btn-text">Добавить тренировку</span>
        </Link>
      </div>

      {/* Карточки со статистикой */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value">{workouts.length}</div>
          <div className="stat-label">Всего тренировок</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{totalStats.totalDuration} мин</div>
          <div className="stat-label">Общее время</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{totalStats.totalCalories} ккал</div>
          <div className="stat-label">Сожжено калорий</div>
        </div>
      </div>

      {/* Секция с типами тренировок */}
      <section>
        <div className="section-title">
          <h2>Типы тренировок</h2>
        </div>

        <div className="workout-types-grid">
          {WORKOUT_TYPES.map((type) => (
            <div
              key={type}
              className="workout-type-card"
              onClick={() => (window.location.href = "/workout?type=" + type)}
            >
              <div
                className="workout-type-icon"
                style={{
                  backgroundColor: WORKOUT_COLORS[type],
                  color: "#fff",
                }}
              >
                <WorkoutTypeIcon type={type} />
              </div>
              <div className="workout-type-name">{WORKOUT_LABELS[type]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Последние тренировки */}
      <section>
        <div className="section-title">
          <h2>Недавние тренировки</h2>
        </div>

        <div className="recent-workouts">
          {workouts.length === 0 ? (
            <div className="paper">
              <p>
                У вас пока нет записанных тренировок. Добавьте свою первую
                тренировку!
              </p>
            </div>
          ) : (
            workouts.slice(0, 5).map((workout) => (
              <div className="recent-workout-card" key={workout.id}>
                <div className="workout-icon-container">
                  <div
                    className="workout-icon"
                    style={{
                      backgroundColor: WORKOUT_COLORS[workout.type],
                      color: "#fff",
                    }}
                  >
                    <WorkoutTypeIcon type={workout.type} />
                  </div>
                </div>

                <div className="workout-details">
                  <h3>{WORKOUT_LABELS[workout.type]}</h3>

                  <div className="workout-meta">
                    <div className="workout-meta-item">
                      <FiClock />
                      {workout.duration} мин
                    </div>
                    <div className="workout-meta-item">
                      <FiZap />
                      {workout.calories} ккал
                    </div>
                    <div className="workout-meta-item">
                      <FiCalendar />
                      {new Date(workout.date).toLocaleDateString("ru-RU")}
                    </div>
                  </div>

                  {workout.notes && (
                    <div className="workout-notes">{workout.notes}</div>
                  )}
                </div>

                <button
                  className="workout-delete-btn"
                  onClick={() => deleteWorkout(workout.id)}
                  aria-label="Удалить тренировку"
                >
                  <FiX />
                </button>
              </div>
            ))
          )}
        </div>

        {workouts.length > 5 && (
          <div className="flex-row justify-center mt-4">
            <Link to="/statistics" className="btn btn-outline">
              <FiBarChart2 />
              Посмотреть все тренировки
            </Link>
          </div>
        )}
      </section>
    </div>
  );

  // Функция для отображения соответствующих иконок для типа тренировки
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
    <div className={`app ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar />

      <div className="content-wrapper">
        <header className="header">
          <div className="container header-content">
            <div className="header-left">
              <button
                className="menu-toggle"
                onClick={() => setSidebarOpen(true)}
                aria-label="Открыть меню"
              >
                <FiMenu />
              </button>
              <div className="logo">FitTracker</div>
            </div>

            <nav className="header-nav">
              <Link to="/statistics" className="nav-link">
                <FiBarChart2 />
                <span className="nav-text">Статистика</span>
              </Link>
            </nav>
          </div>
        </header>

        <MainContent />

        <footer className="footer">
          <div className="container footer-content">
            <div className="footer-logo">
              <div className="logo">FitTracker</div>
              <p>Следите за своими фитнес достижениями</p>
            </div>

            <div className="footer-copyright">
              Разработано с любовью <strong>Iusif Mamedov</strong>
            </div>
          </div>
        </footer>
      </div>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default HomePage;
