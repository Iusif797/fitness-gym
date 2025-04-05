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
  FormLabel,
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

  // Обработчик для изменения темы
  const handleThemeChange = (event) => {
    updateUserSettings({ theme: event.target.value });
  };

  // Обработчик для изменения языка
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    updateUserSettings({ language: newLanguage });
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

  const handleBack = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
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
                value="light"
                control={<Radio />}
                label={t("settings.lightTheme")}
              />
              <FormControlLabel
                value="dark"
                control={<Radio />}
                label={t("settings.darkTheme")}
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
                value="ru"
                control={<Radio />}
                label={t("settings.languages.ru")}
              />
              <FormControlLabel
                value="en"
                control={<Radio />}
                label={t("settings.languages.en")}
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
      </Paper>
    </Container>
  );
};

export default SettingsPage;
