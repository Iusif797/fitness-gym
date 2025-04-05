import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Импортируем хук useAuth

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
        if (isAuthenticated) {
          // Загрузка с API для авторизованного пользователя
          console.log("Loading workouts from API for user:", user?._id);
          const res = await axios.get("/api/workouts");
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
    setError(null);
    try {
      let newWorkout;
      if (isAuthenticated) {
        // Отправляем на API
        console.log("Adding workout via API");
        const res = await axios.post("/api/workouts", workoutData);
        newWorkout = res.data.data;
        setWorkouts((prev) => [newWorkout, ...prev]);
      } else {
        // Добавляем в localStorage
        console.log("Adding workout to localStorage (anonymous)");
        newWorkout = {
          _id: uuidv4(), // Генерируем временный ID для localStorage
          date: new Date().toISOString(),
          ...workoutData,
        };
        setWorkouts((prev) => [newWorkout, ...prev]);
        // Сохранение произойдет в useEffect [workouts]
      }
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add workout";
      console.error("Add Workout Error:", message);
      setError(message);
      return false;
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
      if (isAuthenticated) {
        // Удаляем через API
        console.log(`Deleting workout ${id} via API`);
        await axios.delete(`/api/workouts/${id}`);
      } else {
        // Удаляем из localStorage (сохранение произойдет в useEffect)
        console.log(`Deleting workout ${id} from localStorage (anonymous)`);
      }
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
    setError(null);
    try {
      let updatedWorkout;
      if (isAuthenticated) {
        const res = await axios.put(`/api/workouts/${id}`, updatedData);
        updatedWorkout = res.data.data;
      } else {
        // Обновление в localStorage
        const workoutIndex = workouts.findIndex((w) => (w._id || w.id) === id);
        if (workoutIndex === -1) throw new Error("Workout not found locally");
        updatedWorkout = { ...workouts[workoutIndex], ...updatedData };
      }
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
        if (isAuthenticated) {
          // TODO: Реализовать эндпоинт для очистки всех тренировок пользователя?
          // Пока удаляем по одной
          setLoading(true);
          const promises = workouts.map((w) =>
            axios.delete(`/api/workouts/${w._id}`)
          );
          await Promise.all(promises);
          setWorkouts([]);
          console.log("Cleared all workouts via API");
        } else {
          setWorkouts([]);
          localStorage.removeItem("anonymousWorkouts");
          console.log("Cleared all anonymous workouts from localStorage");
        }
        return true;
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
