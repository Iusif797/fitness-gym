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
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        // Устанавливаем токен в заголовки axios по умолчанию
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const res = await axios.get(`${API_URL}/auth/me`); // Используем API_URL вместо захардкоженного пути
          setUser(res.data.data); // Предполагаем, что данные пользователя в res.data.data

          // Устанавливаем язык из настроек пользователя если есть
          if (res.data.data.settings && res.data.data.settings.language) {
            i18n.changeLanguage(res.data.data.settings.language);
          }
        } catch (err) {
          console.error(
            "Failed to load user:",
            err.response ? err.response.data : err.message
          );
          localStorage.removeItem("token"); // Удаляем невалидный токен
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
        }
      } else {
        // Если токена нет, пользователь не аутентифицирован
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Функция регистрации
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      // После успешной регистрации сразу загружаем пользователя
      const userRes = await axios.get(`${API_URL}/auth/me`);
      setUser(userRes.data.data);

      // Устанавливаем язык из настроек пользователя если есть
      if (userRes.data.data.settings && userRes.data.data.settings.language) {
        i18n.changeLanguage(userRes.data.data.settings.language);
      }

      return true; // Успех
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      console.error("Registration Error:", message);
      setError(message);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      return false; // Ошибка
    }
  };

  // Функция входа
  const login = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, userData);
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      // После успешного входа загружаем пользователя
      const userRes = await axios.get(`${API_URL}/auth/me`);
      setUser(userRes.data.data);

      // Устанавливаем язык из настроек пользователя если есть
      if (userRes.data.data.settings && userRes.data.data.settings.language) {
        i18n.changeLanguage(userRes.data.data.settings.language);
      }

      return true; // Успех
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      console.error("Login Error:", message);
      setError(message);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      return false; // Ошибка
    }
  };

  // Функция выхода
  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Функция обновления настроек пользователя (теперь через API)
  const updateUserSettings = async (settings) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(`${API_URL}/auth/settings`, settings, config);

      // Обновляем пользователя в состоянии контекста
      setUser((prevUser) => ({
        ...prevUser,
        settings: res.data.data.settings,
      }));

      // Обновляем язык если он изменился
      if (settings.language) {
        i18n.changeLanguage(settings.language);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update settings";
      console.error("Settings Update Error:", message);
      setError(message);
    }
  };

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
        updateUserSettings, // Заменяем старую функцию
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
