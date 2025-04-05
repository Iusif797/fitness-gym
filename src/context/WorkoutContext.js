import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Импортируем хук useAuth

// Добавляем определение базового URL
const API_URL =
  process.env.NODE_ENV === "production"
    ? "/api" // В продакшене используем относительный путь, который будет обрабатываться через Vercel
    : "http://localhost:5000/api"; // В разработке используем абсолютный URL

// Создаем контекст
export const WorkoutContext = createContext(null);

/**
 * Провайдер контекста тренировок
 */
export const WorkoutProvider = ({ children }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth(); // Получаем статус пользователя
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStats, setTotalStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    workoutsByType: {},
    workoutsByMonth: {},
  });

  // Загрузка тренировок при инициализации или смене статуса аутентификации
  useEffect(() => {
    // Не загружаем данные, пока не определен статус аутентификации
    if (authLoading) {
      setLoading(true);
      return;
    }

    setLoading(true);
    setError(null);

    const loadWorkouts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        if (isAuthenticated) {
          // Загрузка с API для авторизованного пользователя
          console.log("Loading workouts from API for user:", user?._id);
          const res = await axios.get(`${API_URL}/workouts`, config);
          setWorkouts(res.data.data || []);
        } else {
          // Загрузка из localStorage для анонимного пользователя
          console.log("Loading workouts from localStorage (anonymous)");
          const storedWorkouts = localStorage.getItem("anonymousWorkouts"); // Используем другое ключ
          setWorkouts(storedWorkouts ? JSON.parse(storedWorkouts) : []);
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to load workouts";
        console.error("Workout Loading Error:", message);
        setError(message);
        setWorkouts([]); // Сбрасываем тренировки при ошибке
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
    // Перезагружаем при смене статуса аутентификации
  }, [isAuthenticated, authLoading, user?._id]);

  // Функция обновления статистики (без изменений, работает с текущим состоянием workouts)
  const updateStats = useCallback(() => {
    // Расчет общего количества тренировок, продолжительности и калорий
    const totalDuration = workouts.reduce(
      (sum, workout) => sum + workout.duration,
      0
    );
    const totalCalories = workouts.reduce(
      (sum, workout) => sum + (workout.calories || 0), // Учитываем, что калорий может не быть
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
        // TODO: Использовать язык из настроек
        month: "short",
      })} ${date.getFullYear()}`;
      workoutsByMonth[monthKey] = 0;
    }

    workouts.forEach((workout) => {
      const date = new Date(workout.date);
      // Проверка на валидность даты
      if (isNaN(date.getTime())) {
        console.warn("Invalid date found in workout:", workout);
        return; // Пропускаем тренировку с невалидной датой
      }
      const monthKey = `${date.toLocaleString("ru-RU", {
        // TODO: Использовать язык из настроек
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
    // Сохраняем тренировки в localStorage ТОЛЬКО для анонимного пользователя
    if (!isAuthenticated && !authLoading) {
      console.log("Saving anonymous workouts to localStorage");
      localStorage.setItem("anonymousWorkouts", JSON.stringify(workouts));
    }
  }, [workouts, updateStats, isAuthenticated, authLoading]);

  // Добавление новой тренировки
  const addWorkout = async (workoutData) => {
    setLoading(true);
    setError(null);

    try {
      // Добавляем уникальный ID и дату для тренировки, если их нет
      const workout = {
        ...workoutData,
        id: workoutData.id || `local-${Date.now()}`,
        date: workoutData.date || new Date().toISOString(),
      };

      if (isAuthenticated) {
        // Для авторизованных пользователей, отправляем на сервер
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.post(`${API_URL}/workouts`, workout, config);
        const newWorkout = res.data.data;
        setWorkouts((prev) => [newWorkout, ...prev]);
        console.log("Workout added to API:", newWorkout);
      } else {
        // Для неавторизованных пользователей, сохраняем локально
        console.log("Adding workout locally (anonymous user):", workout);
        // Обновляем состояние с новой тренировкой
        setWorkouts((prev) => [workout, ...prev]);

        // Получаем текущие тренировки из localStorage
        const storedWorkouts = localStorage.getItem("anonymousWorkouts");
        const parsedWorkouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];

        // Добавляем новую тренировку в начало массива
        const updatedWorkouts = [workout, ...parsedWorkouts];

        // Сохраняем обновленный массив в localStorage
        localStorage.setItem(
          "anonymousWorkouts",
          JSON.stringify(updatedWorkouts)
        );
      }
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add workout";
      console.error("Add Workout Error:", message, err);
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Удаление тренировки
  const deleteWorkout = async (id) => {
    setError(null);
    const workoutToDelete = workouts.find((w) => (w._id || w.id) === id);
    if (!workoutToDelete) return;

    if (
      !window.confirm(
        `Удалить тренировку ${workoutToDelete.type} от ${new Date(
          workoutToDelete.date
        ).toLocaleDateString("ru-RU")}?`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${API_URL}/workouts/${id}`, config);
      // Оптимистичное удаление из UI
      setWorkouts((prev) =>
        prev.filter((workout) => (workout._id || workout.id) !== id)
      );
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete workout";
      console.error("Delete Workout Error:", message);
      setError(message);
      // Можно реализовать откат UI при ошибке, но пока оставим так
      return false;
    }
  };

  // Обновление тренировки (пока не реализовано в UI, но можно добавить)
  const updateWorkout = async (id, updatedData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `${API_URL}/workouts/${id}`,
        updatedData,
        config
      );
      const updatedWorkout = res.data.data;
      setWorkouts((prev) =>
        prev.map((w) => ((w._id || w.id) === id ? updatedWorkout : w))
      );
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update workout";
      console.error("Update Workout Error:", message);
      setError(message);
      return false;
    }
  };

  // Очистка всех тренировок
  const clearWorkouts = async () => {
    setError(null);
    if (
      window.confirm(
        "Вы уверены, что хотите удалить ВСЕ тренировки? Это действие нельзя отменить."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // TODO: Реализовать эндпоинт для очистки всех тренировок пользователя?
        // Пока удаляем по одной
        setLoading(true);
        const promises = workouts.map((w) =>
          axios.delete(`${API_URL}/workouts/${w._id}`, config)
        );
        await Promise.all(promises);
        setWorkouts([]);
        console.log("Cleared all workouts via API");
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to clear workouts";
        console.error("Clear Workouts Error:", message);
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    }
    return false;
  };

  // Экспорт данных (теперь только для localStorage)
  const exportData = () => {
    if (isAuthenticated) {
      alert(
        "Экспорт данных для авторизованных пользователей пока не реализован."
      );
      return;
    }
    const data = {
      workouts,
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

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        loading,
        error,
        totalStats,
        // userSettings теперь берем из useAuth() -> user.settings
        // Настройки для анонимного пользователя можно хранить локально, если нужно
        addWorkout,
        deleteWorkout,
        updateWorkout,
        // updateUserSettings - теперь в AuthContext
        clearWorkouts,
        exportData,
        // toggleTheme - удалена
        setError, // Передаем для сброса ошибок
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
