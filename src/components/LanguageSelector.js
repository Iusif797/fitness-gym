import React from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Box, Tooltip } from "@mui/material";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const flagUrls = {
    en: "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/gb.svg",
    ru: "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/ru.svg",
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem(
      "userSettings",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("userSettings") || "{}"),
        language: newLang,
      })
    );
  };

  return (
    <Tooltip
      title={
        i18n.language === "en"
          ? "Switch to Russian"
          : "Переключить на английский"
      }
    >
      <IconButton onClick={toggleLanguage} size="large">
        <Box
          component="img"
          src={flagUrls[i18n.language]}
          alt={i18n.language === "en" ? "English" : "Русский"}
          sx={{
            width: 24,
            height: 24,
            objectFit: "cover",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

export default LanguageSelector;
