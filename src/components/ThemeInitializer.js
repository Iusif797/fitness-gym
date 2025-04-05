import React, { useEffect } from "react";

const ThemeInitializer = ({ children }) => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("userSettings")
      ? JSON.parse(localStorage.getItem("userSettings")).theme
      : null;

    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
      document.body.className =
        savedTheme === "dark" ? "dark-theme" : "light-theme";
    } else {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const defaultTheme = prefersDarkMode ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", defaultTheme);
      document.body.className =
        defaultTheme === "dark" ? "dark-theme" : "light-theme";
      localStorage.setItem(
        "userSettings",
        JSON.stringify({ theme: defaultTheme })
      );
    }
  }, []);

  return children;
};

export default ThemeInitializer;
