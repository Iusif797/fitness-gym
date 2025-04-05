import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import moment from "moment";
import { useAuth } from "./AuthContext"; // Импортируем хук useAuth

// Добавляем определение базового URL
const API_URL =
  process.env.NODE_ENV === "production"
    ? "/api" // В продакшене используем относительный путь, который будет обрабатываться через Vercel
    : "http://localhost:5000/api"; // В разработке используем абсолютный URL

// Создаем контекст
const WorkoutContext = createContext();

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

  // Загрузка тренировок при монтировании компонента или изменении пользователя
  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Получаем данные из localStorage
        const storedWorkouts = localStorage.getItem("workouts");

        if (storedWorkouts) {
          const parsedWorkouts = JSON.parse(storedWorkouts);
          // Фильтруем тренировки по userId, если пользователь авторизован
          const filteredWorkouts = user
            ? parsedWorkouts.filter((workout) => workout.userId === user.uid)
            : parsedWorkouts.filter(
                (workout) => !workout.userId || workout.userId === "guest"
              );

          setWorkouts(filteredWorkouts);
        } else {
          setWorkouts([]);
        }
      } catch (err) {
        console.error("Ошибка при загрузке тренировок:", err);
        setError("Ошибка при загрузке тренировок");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [user]);

  // Функция обновления статистики
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

    // Группировка по месяцам (за последние 6 месяцев) с использованием moment
    const workoutsByMonth = {};
    const today = moment();

    for (let i = 0; i < 6; i++) {
      const date = moment(today).subtract(i, "months");
      const monthKey = date.format("MMM YYYY");
      workoutsByMonth[monthKey] = 0;
    }

    workouts.forEach((workout) => {
      const date = moment(workout.date);
      // Проверка на валидность даты
      if (!date.isValid()) {
        console.warn("Invalid date found in workout:", workout);
        return; // Пропускаем тренировку с невалидной датой
      }
      const monthKey = date.format("MMM YYYY");

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
    try {
      const newWorkout = {
        ...workoutData,
        id: Date.now().toString(),
        userId: user ? user.uid : "guest",
        createdAt: new Date().toISOString(),
      };

      const updatedWorkouts = [...workouts, newWorkout];
      setWorkouts(updatedWorkouts);

      // Сохраняем в localStorage
      const storedWorkouts = localStorage.getItem("workouts");
      let allWorkouts = [];

      if (storedWorkouts) {
        allWorkouts = JSON.parse(storedWorkouts);
      }

      allWorkouts.push(newWorkout);
      localStorage.setItem("workouts", JSON.stringify(allWorkouts));

      return { success: true };
    } catch (err) {
      console.error("Ошибка при добавлении тренировки:", err);
      setError("Ошибка при добавлении тренировки");
      return { success: false, error: err.message };
    }
  };

  // Удаление тренировки
  const deleteWorkout = async (id) => {
    try {
      const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
      setWorkouts(updatedWorkouts);

      // Удаляем из localStorage
      const storedWorkouts = localStorage.getItem("workouts");

      if (storedWorkouts) {
        const allWorkouts = JSON.parse(storedWorkouts);
        const updatedAllWorkouts = allWorkouts.filter(
          (workout) => workout.id !== id
        );

        localStorage.setItem("workouts", JSON.stringify(updatedAllWorkouts));
      }

      return { success: true };
    } catch (err) {
      console.error("Ошибка при удалении тренировки:", err);
      setError("Ошибка при удалении тренировки");
      return { success: false, error: err.message };
    }
  };

  // Обновление тренировки
  const updateWorkout = async (id, updatedData) => {
    try {
      const updatedWorkouts = workouts.map((workout) =>
        workout.id === id ? { ...workout, ...updatedData } : workout
      );

      setWorkouts(updatedWorkouts);

      // Обновляем в localStorage
      const storedWorkouts = localStorage.getItem("workouts");

      if (storedWorkouts) {
        const allWorkouts = JSON.parse(storedWorkouts);
        const updatedAllWorkouts = allWorkouts.map((workout) =>
          workout.id === id ? { ...workout, ...updatedData } : workout
        );

        localStorage.setItem("workouts", JSON.stringify(updatedAllWorkouts));
      }

      return { success: true };
    } catch (err) {
      console.error("Ошибка при обновлении тренировки:", err);
      setError("Ошибка при обновлении тренировки");
      return { success: false, error: err.message };
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

  // Создание нескольких тестовых тренировок (для демонстрации)
  const createSampleWorkouts = () => {
    // Эта функция добавляет несколько примеров тренировок
    const sampleWorkouts = [
      {
        id: "1",
        name: "Кардио тренировка",
        type: "cardio",
        duration: 45,
        date: new Date(Date.now() - 86400000).toISOString(), // вчера
        userId: user ? user.uid : "guest",
        notes: "Бег на беговой дорожке и эллиптический тренажер",
        intensity: "medium",
      },
      {
        id: "2",
        name: "Силовая тренировка",
        type: "strength",
        duration: 60,
        date: new Date(Date.now() - 172800000).toISOString(), // позавчера
        userId: user ? user.uid : "guest",
        notes: "Жим лежа, приседания, тяга",
        intensity: "high",
      },
      {
        id: "3",
        name: "Йога",
        type: "flexibility",
        duration: 30,
        date: new Date(Date.now() - 432000000).toISOString(), // 5 дней назад
        userId: user ? user.uid : "guest",
        notes: "Расслабляющая йога перед сном",
        intensity: "low",
      },
    ];

    try {
      // Сохраняем в localStorage
      localStorage.setItem("workouts", JSON.stringify(sampleWorkouts));
      setWorkouts(sampleWorkouts);
      return { success: true };
    } catch (err) {
      console.error("Ошибка при создании примеров тренировок:", err);
      return { success: false, error: err.message };
    }
  };

  // Инициализация сохранения, если пользователь впервые открыл приложение
  useEffect(() => {
    if (!localStorage.getItem("workouts")) {
      // Чтобы не создавать пример автоматически, закомментируем это
      // createSampleWorkouts();
      localStorage.setItem("workouts", JSON.stringify([]));
    }
  }, []);

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
        createSampleWorkouts,
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
