import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationRU from "./locales/ru.json";
import translationEN from "./locales/en.json";

// Ресурсы с переводами
const resources = {
  ru: {
    translation: translationRU,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  // Определение языка браузера
  .use(LanguageDetector)
  // Передаем i18n экземпляр в react-i18next
  .use(initReactI18next)
  // Инициализация i18next
  .init({
    resources,
    fallbackLng: "ru", // Язык по умолчанию
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false, // Не нужно для React
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
