import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import i18n from "i18next";

const AuthContext = createContext(null);

// Добавляем определение базового URL
const API_URL =
  process.env.NODE_ENV === "production"
    ? "/api" // В продакшене используем относительный путь, который будет обрабатываться через Vercel
    : "http://localhost:5000/api"; // В разработке используем абсолютный URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Начальная загрузка состояния пользователя
  const [error, setError] = useState(null);

  // Проверка состояния входа при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
    setLoading(false);
  }, []);

  // Функция регистрации
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      // Устанавливаем язык из настроек пользователя если есть
      if (user.settings && user.settings.language) {
        i18n.changeLanguage(user.settings.language);
      }

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Ошибка регистрации";
      console.error("Registration Error:", message);
      setError(message);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      return { success: false, error: message };
    }
  };

  // Функция входа
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      // Устанавливаем язык из настроек пользователя если есть
      if (user.settings && user.settings.language) {
        i18n.changeLanguage(user.settings.language);
      }

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Ошибка входа";
      console.error("Login Error:", message);
      setError(message);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      return { success: false, error: message };
    }
  };

  // Функция выхода
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // Функция обновления настроек пользователя
  const updateUserSettings = (settings) => {
    const updatedUser = { ...user, settings };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Применяем настройки темы к document
    if (settings.theme) {
      // Устанавливаем data-theme атрибут для корневого элемента
      document.documentElement.setAttribute("data-theme", settings.theme);

      // Обновляем класс для body
      document.body.className =
        settings.theme === "dark" ? "dark-theme" : "light-theme";

      // Принудительно обновляем стили на странице
      const event = new Event("themeChanged");
      window.dispatchEvent(event);

      // Перезагружаем стили без перезагрузки страницы
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href) {
          const newHref = href.includes("?")
            ? `${href}&theme=${Date.now()}`
            : `${href}?theme=${Date.now()}`;
          link.setAttribute("href", newHref);
        }
      });

      console.log("Theme updated to:", settings.theme);
    }

    // Обновляем язык если он изменился
    if (settings.language) {
      i18n.changeLanguage(settings.language);
    }
  };

  // При инициализации также загружаем настройки для неавторизованных пользователей
  useEffect(() => {
    // Если пользователь не авторизован, загружаем настройки из localStorage
    if (!user && !loading) {
      const localSettings = JSON.parse(
        localStorage.getItem("userSettings") || "{}"
      );

      // Устанавливаем настройки из localStorage
      if (Object.keys(localSettings).length > 0) {
        console.log("Loading settings from localStorage:", localSettings);

        // Применяем тему
        if (localSettings.theme) {
          document.documentElement.setAttribute(
            "data-theme",
            localSettings.theme
          );
          document.body.className =
            localSettings.theme === "dark" ? "dark-theme" : "light-theme";
        }

        // Применяем язык
        if (localSettings.language) {
          i18n.changeLanguage(localSettings.language);
        }

        // Создаем объект пользователя с настройками
        setUser({
          name: "Guest",
          settings: localSettings,
        });
      }
    }
  }, [user, loading]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user, // Простой флаг аутентификации
        register,
        login,
        logout,
        updateUserSettings,
        setError, // Для сброса ошибок извне
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
