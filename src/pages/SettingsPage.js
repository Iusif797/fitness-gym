import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Paper,
  Button,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LanguageIcon from "@mui/icons-material/Language";
import SaveIcon from "@mui/icons-material/Save";

const SettingsPage = () => {
  const {
    user,
    isLoading,
    error,
    updateUserSettings,
    isAuthenticated,
    logout,
  } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  // Если загрузка - показываем прогресс
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Улучшаем обработчик изменения темы
  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    updateUserSettings({ ...user?.settings, theme: newTheme });
    // Немедленно применяем тему для лучшего UX
    document.documentElement.setAttribute("data-theme", newTheme);
    document.body.className =
      newTheme === "dark" ? "dark-theme" : "light-theme";
  };

  // Улучшаем обработчик изменения языка
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    updateUserSettings({ ...user?.settings, language: newLanguage });
    // Немедленно применяем язык для лучшего UX
    i18n.changeLanguage(newLanguage);
  };

  // Обработчик для изменения единиц измерения
  const handleUnitsChange = (event) => {
    updateUserSettings({ units: event.target.value });
  };

  // Обработчик для изменения отображения калорий
  const handleShowCaloriesChange = (event) => {
    updateUserSettings({ showCalories: event.target.checked });
  };

  // Обработчик для изменения отображения таймера
  const handleShowTimerChange = (event) => {
    updateUserSettings({ showTimer: event.target.checked });
  };

  // Улучшаем обработчик сохранения настроек
  const handleSaveSettings = async () => {
    try {
      // Обновляем настройки через контекст
      const result = await updateUserSettings(user?.settings);

      if (result) {
        // Обновляем локальные настройки
        localStorage.setItem("userSettings", JSON.stringify(user?.settings));

        // Перезагружаем стили для корректного применения темы
        const event = new Event("themeChanged");
        window.dispatchEvent(event);
      } else {
        console.error("Settings save error");
      }
    } catch (err) {
      console.error("Settings save error:", err);
    } finally {
      // Прокручиваем страницу вверх к сообщению об успехе/ошибке
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={2}
          sx={{
            mt: 2,
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1">
              {t("settings.settings")}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t("settings.theme")}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="theme"
                value={user?.settings?.theme || "dark"}
                onChange={handleThemeChange}
              >
                <FormControlLabel
                  value="dark"
                  control={
                    <Radio
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.main
                            : undefined,
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <DarkModeIcon sx={{ mr: 1, fontSize: 20 }} />
                      {t("settings.darkTheme")}
                    </Box>
                  }
                  sx={{
                    mr: 4,
                    p: 1,
                    borderRadius: 2,
                    ...(user?.settings?.theme === "dark" && {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }),
                  }}
                />
                <FormControlLabel
                  value="light"
                  control={
                    <Radio
                      sx={{
                        color:
                          theme.palette.mode === "light"
                            ? theme.palette.primary.main
                            : undefined,
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LightModeIcon sx={{ mr: 1, fontSize: 20 }} />
                      {t("settings.lightTheme")}
                    </Box>
                  }
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    ...(user?.settings?.theme === "light" && {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }),
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t("settings.language")}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="language"
                value={user?.settings?.language || i18n.language}
                onChange={handleLanguageChange}
              >
                <FormControlLabel
                  value="en"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="img"
                        src="/images/en.png"
                        alt="English"
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          display: "inline-block",
                          borderRadius: "50%",
                        }}
                      />
                      English
                    </Box>
                  }
                  sx={{
                    mr: 4,
                    p: 1,
                    borderRadius: 2,
                    ...(user?.settings?.language === "en" && {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }),
                  }}
                />
                <FormControlLabel
                  value="ru"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="img"
                        src="/images/ru.png"
                        alt="Русский"
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          display: "inline-block",
                          borderRadius: "50%",
                        }}
                      />
                      Русский
                    </Box>
                  }
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    ...(user?.settings?.language === "ru" && {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }),
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t("settings.units")}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="units"
                value={user?.settings?.units || "metric"}
                onChange={handleUnitsChange}
              >
                <FormControlLabel
                  value="metric"
                  control={<Radio />}
                  label={t("settings.unitTypes.metric")}
                />
                <FormControlLabel
                  value="imperial"
                  control={<Radio />}
                  label={t("settings.unitTypes.imperial")}
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t("settings.workoutOptions")}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={user?.settings?.showCalories ?? true}
                  onChange={handleShowCaloriesChange}
                  name="showCalories"
                />
              }
              label={t("settings.showCalories")}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={user?.settings?.showTimer ?? true}
                  onChange={handleShowTimerChange}
                  name="showTimer"
                />
              }
              label={t("settings.showTimer")}
            />
          </Box>

          {isAuthenticated && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {t("settings.account")}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/account")}
                  sx={{ mr: 2 }}
                >
                  {t("auth.profile")}
                </Button>

                <Button variant="outlined" color="error" onClick={handleLogout}>
                  {t("auth.logout")}
                </Button>
              </Box>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSaveSettings}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: `0 6px 25px ${alpha(
                  theme.palette.primary.main,
                  0.5
                )}`,
                transform: "translateY(-2px)",
              },
            }}
          >
            {t("common.save")}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default SettingsPage;
