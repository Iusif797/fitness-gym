import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";

// Создаем контекст
export const WorkoutContext = createContext(null);

/**
 * Провайдер контекста тренировок
 */
export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    workoutsByType: {},
    workoutsByMonth: {},
  });
  const [userSettings, setUserSettings] = useState({
    name: "Пользователь",
    email: "user@example.com",
    theme: "dark",
    language: "ru",
    units: "metric",
    notifications: true,
    showCalories: true,
    showTimer: true,
  });

  // Загружаем тренировки и настройки из localStorage при инициализации
  useEffect(() => {
    const storedWorkouts = localStorage.getItem("workouts");
    const storedSettings = localStorage.getItem("userSettings");

    if (storedWorkouts) {
      setWorkouts(JSON.parse(storedWorkouts));
    }

    if (storedSettings) {
      setUserSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Обновляем статистику при изменении тренировок
  const updateStats = useCallback(() => {
    // Расчет общего количества тренировок, продолжительности и калорий
    const totalDuration = workouts.reduce(
      (sum, workout) => sum + workout.duration,
      0
    );
    const totalCalories = workouts.reduce(
      (sum, workout) => sum + workout.calories,
      0
    );

    // Группировка по типу тренировки
    const workoutsByType = {};
    workouts.forEach((workout) => {
      workoutsByType[workout.type] = (workoutsByType[workout.type] || 0) + 1;
    });

    // Группировка по месяцам (за последние 6 месяцев)
    const workoutsByMonth = {};
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      const monthKey = `${date.toLocaleString("ru-RU", {
        month: "short",
      })} ${date.getFullYear()}`;
      workoutsByMonth[monthKey] = 0;
    }

    workouts.forEach((workout) => {
      const date = new Date(workout.date);
      const monthKey = `${date.toLocaleString("ru-RU", {
        month: "short",
      })} ${date.getFullYear()}`;

      if (monthKey in workoutsByMonth) {
        workoutsByMonth[monthKey]++;
      }
    });

    setTotalStats({
      totalWorkouts: workouts.length,
      totalDuration,
      totalCalories,
      workoutsByType,
      workoutsByMonth,
    });
  }, [workouts]);

  // Обновляем статистику при изменении тренировок
  useEffect(() => {
    updateStats();
    // Сохраняем тренировки в localStorage
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts, updateStats]);

  // Сохраняем настройки пользователя в localStorage
  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(userSettings));
  }, [userSettings]);

  // Добавление новой тренировки
  const addWorkout = (workout) => {
    // Создаем объект тренировки с ID и датой
    const newWorkout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...workout,
    };

    setWorkouts([newWorkout, ...workouts]);
  };

  // Удаление тренировки
  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter((workout) => workout.id !== id));
  };

  // Обновление тренировки
  const updateWorkout = (id, updatedWorkout) => {
    setWorkouts(
      workouts.map((workout) =>
        workout.id === id ? { ...workout, ...updatedWorkout } : workout
      )
    );
  };

  // Обновление настроек пользователя
  const updateUserSettings = (newSettings) => {
    setUserSettings({ ...userSettings, ...newSettings });
  };

  // Очистка всех тренировок
  const clearWorkouts = () => {
    if (
      window.confirm(
        "Вы уверены, что хотите удалить все тренировки? Это действие нельзя отменить."
      )
    ) {
      setWorkouts([]);
    }
  };

  // Экспорт данных
  const exportData = () => {
    const data = {
      workouts,
      userSettings,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `fitness-tracker-export-${new Date().toLocaleDateString(
      "ru-RU"
    )}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Изменение темы
  const toggleTheme = () => {
    setUserSettings({
      ...userSettings,
      theme: userSettings.theme === "dark" ? "light" : "dark",
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        totalStats,
        userSettings,
        addWorkout,
        deleteWorkout,
        updateWorkout,
        updateUserSettings,
        clearWorkouts,
        exportData,
        toggleTheme,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

// Хук для использования контекста
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout должен использоваться внутри WorkoutProvider");
  }
  return context;
};
