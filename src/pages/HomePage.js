import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, alpha } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { useWorkout } from "../context/WorkoutContext";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Grid,
  CircularProgress,
  Paper,
  Grow,
  Zoom,
  Fab,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import TimelineIcon from "@mui/icons-material/Timeline";
import WorkoutCard from "../components/WorkoutCard";
import moment from "moment";
import "moment/locale/ru";

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { workouts, isLoading, error, deleteWorkout } = useWorkout();
  const { user, isAuthenticated, logout, updateUserSettings } = useAuth();
  const { t, i18n } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    totalWorkouts: 0,
    thisMonth: 0,
    streakDays: 0,
  });
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Настраиваем локаль для moment
  moment.locale(i18n.language === "ru" ? "ru" : "en");

  // Добавляем состояние для календаря
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [calendarWorkouts, setCalendarWorkouts] = useState({});

  // Состояние для опций фитнес-зала
  const [gymDialogOpen, setGymDialogOpen] = useState(false);

  // Обработка статистики пользователя
  useEffect(() => {
    if (workouts.length > 0) {
      // Общее количество тренировок
      const totalWorkouts = workouts.length;

      // Тренировки за текущий месяц
      const currentMonth = moment().month();
      const currentYear = moment().year();
      const thisMonth = workouts.filter((workout) => {
        const workoutDate = moment(workout.date);
        return (
          workoutDate.month() === currentMonth &&
          workoutDate.year() === currentYear
        );
      }).length;

      // Подсчет streak (последовательных дней)
      let streakDays = 0;
      // Улучшенный подсчет последовательных дней тренировок
      const sortedDates = workouts
        .map((w) => moment(w.date).startOf("day").valueOf())
        .sort((a, b) => b - a); // Сортировка от новых к старым

      if (sortedDates.length > 0) {
        let currentStreak = 1;
        let maxStreak = 1;

        // Проверка, была ли тренировка сегодня
        const today = moment().startOf("day").valueOf();
        const yesterdayDate = moment()
          .subtract(1, "day")
          .startOf("day")
          .valueOf();

        let streakStartDate = sortedDates[0] === today ? today : null;

        // Если первая дата не сегодня, начинаем с 0
        if (streakStartDate === null) {
          currentStreak = 0;
          maxStreak = 0;
        }

        for (let i = 1; i < sortedDates.length; i++) {
          const curr = sortedDates[i - 1];
          const prev = sortedDates[i];

          const diff = Math.round((curr - prev) / (24 * 60 * 60 * 1000));

          if (diff === 1) {
            // Последовательные дни
            currentStreak++;
            if (!streakStartDate && i === 1 && curr === yesterdayDate) {
              streakStartDate = curr;
            }
          } else if (diff > 1) {
            // Разрыв последовательности
            if (currentStreak > maxStreak) {
              maxStreak = currentStreak;
            }
            currentStreak = 1;
            streakStartDate = null;
          }
        }

        streakDays = Math.max(currentStreak, maxStreak);
      }

      setUserStats({
        totalWorkouts,
        thisMonth,
        streakDays,
      });
    }
  }, [workouts]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAddWorkout = () => {
    navigate("/workout");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  // Функция для отображения календаря
  const handleCalendar = () => {
    // Подготавливаем данные для календаря
    const workoutsByDate = {};
    workouts.forEach((workout) => {
      const date = moment(workout.date);
      const dateStr = date.format("YYYY-MM-DD");

      if (!workoutsByDate[dateStr]) {
        workoutsByDate[dateStr] = [];
      }
      workoutsByDate[dateStr].push(workout);
    });

    setCalendarWorkouts(workoutsByDate);
    setCalendarOpen(true);
    setDrawerOpen(false);
  };

  // Функция для закрытия календаря
  const handleCloseCalendar = () => {
    setCalendarOpen(false);
  };

  // Функция для выбора даты в календаре
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Можно сделать что-то с выбранной датой, например, отфильтровать тренировки
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/account");
  };

  const handleThemeToggle = () => {
    const newTheme = theme.palette.mode === "dark" ? "light" : "dark";
    updateUserSettings({ theme: newTheme });
  };

  // Обработчик для опций фитнес-зала
  const handleGymOptions = () => {
    setGymDialogOpen(true);
    setDrawerOpen(false);
  };

  // Функция закрытия опций фитнес-зала
  const handleCloseGymDialog = () => {
    setGymDialogOpen(false);
  };

  // Функция перехода к групповым тренировкам
  const handleGroupWorkouts = () => {
    // В будущем можно добавить реальную навигацию к групповым тренировкам
    alert(t("gym.groupWorkoutsComingSoon"));
    setGymDialogOpen(false);
  };

  // Функция перехода к управлению членами зала
  const handleMembers = () => {
    // В будущем можно добавить реальную навигацию к управлению членами
    alert(t("gym.membersManagementComingSoon"));
    setGymDialogOpen(false);
  };

  // Функция перехода к аналитике
  const handleAnalytics = () => {
    // В будущем можно добавить реальную навигацию к аналитике
    alert(t("gym.analyticsComingSoon"));
    setGymDialogOpen(false);
  };

  // Вычисляем цвета в зависимости от темы
  const accentColor =
    theme.palette.mode === "dark"
      ? theme.palette.primary.light
      : theme.palette.primary.main;

  const secondAccentColor =
    theme.palette.mode === "dark" ? "#EC4899" : "#8B5CF6";

  // Рассчитываем прогресс для прогресс-баров
  const monthProgress =
    userStats.thisMonth > 0
      ? Math.min(100, (userStats.thisMonth / 20) * 100)
      : 0; // Предположим, цель - 20 тренировок в месяц

  const streakProgress =
    userStats.streakDays > 0
      ? Math.min(100, (userStats.streakDays / 7) * 100)
      : 0; // Предположим, цель - 7 дней подряд

  return (
    <Box
      className="home-page"
      sx={{
        minHeight: "100vh",
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.default, 0.98)
            : alpha(theme.palette.background.default, 0.97),
        pt: 2,
        pb: 10,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.2
          )} 0%, ${alpha(theme.palette.primary.main, 0)} 70%)`,
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.secondary.main,
            0.2
          )} 0%, ${alpha(theme.palette.secondary.main, 0)} 70%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
            }}
            onClick={handleProfile}
          >
            <Avatar
              sx={{
                width: 50,
                height: 50,
                border: `2px solid ${accentColor}`,
                boxShadow: `0 0 10px ${alpha(accentColor, 0.4)}`,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              }}
            >
              {user?.displayName ? user.displayName.charAt(0) : "U"}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {user?.displayName || t("common.guest")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email ? user.email : t("common.notLoggedIn")}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={handleDrawerToggle}
              color="primary"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            <IconButton
              onClick={handleThemeToggle}
              color="primary"
              className="theme-toggle-icon"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              {theme.palette.mode === "dark" ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>

            <IconButton
              onClick={handleAddWorkout}
              color="primary"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <AddIcon />
            </IconButton>

            <IconButton
              onClick={handleSettings}
              color="primary"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Карточки статистики */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                borderRadius: 4,
                height: "100%",
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.05
                )} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
                boxShadow: `0 10px 20px ${alpha(
                  theme.palette.primary.main,
                  0.1
                )}`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 15px 30px ${alpha(
                    theme.palette.primary.main,
                    0.15
                  )}`,
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background: `radial-gradient(circle, ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )} 0%, transparent 70%)`,
                  borderRadius: "0 0 0 100%",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {t("stats.totalWorkouts")}
                  </Typography>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 40,
                      height: 40,
                      boxShadow: `0 4px 8px ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                    }}
                  >
                    <FitnessCenterIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                  {userStats.totalWorkouts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("stats.totalWorkoutsDesc")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                borderRadius: 4,
                height: "100%",
                background: `linear-gradient(135deg, ${alpha(
                  secondAccentColor,
                  0.05
                )} 0%, ${alpha(secondAccentColor, 0.15)} 100%)`,
                boxShadow: `0 10px 20px ${alpha(secondAccentColor, 0.1)}`,
                border: `1px solid ${alpha(secondAccentColor, 0.2)}`,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 15px 30px ${alpha(secondAccentColor, 0.15)}`,
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background: `radial-gradient(circle, ${alpha(
                    secondAccentColor,
                    0.2
                  )} 0%, transparent 70%)`,
                  borderRadius: "0 0 0 100%",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {t("stats.thisMonth")}
                  </Typography>
                  <Avatar
                    sx={{
                      bgcolor: secondAccentColor,
                      width: 40,
                      height: 40,
                      boxShadow: `0 4px 8px ${alpha(secondAccentColor, 0.3)}`,
                    }}
                  >
                    <CalendarMonthIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                  {userStats.thisMonth}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {t("stats.monthGoal", { goal: 20 })}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={monthProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(secondAccentColor, 0.2),
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: secondAccentColor,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                borderRadius: 4,
                height: "100%",
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.success.main,
                  0.05
                )} 0%, ${alpha(theme.palette.success.main, 0.15)} 100%)`,
                boxShadow: `0 10px 20px ${alpha(
                  theme.palette.success.main,
                  0.1
                )}`,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 15px 30px ${alpha(
                    theme.palette.success.main,
                    0.15
                  )}`,
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background: `radial-gradient(circle, ${alpha(
                    theme.palette.success.main,
                    0.2
                  )} 0%, transparent 70%)`,
                  borderRadius: "0 0 0 100%",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {t("stats.streak")}
                  </Typography>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.success.main,
                      width: 40,
                      height: 40,
                      boxShadow: `0 4px 8px ${alpha(
                        theme.palette.success.main,
                        0.3
                      )}`,
                    }}
                  >
                    <WhatshotIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                  {userStats.streakDays} {t("common.days")}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {t("stats.streakGoal", { goal: 7 })}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={streakProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(theme.palette.success.main, 0.2),
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: theme.palette.success.main,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Заголовок для недавних тренировок */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {t("workout.recentWorkouts")}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleCalendar}
            startIcon={<CalendarMonthIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            {t("workout.viewCalendar")}
          </Button>
        </Box>

        {/* Список недавних тренировок */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper
            className="error-message"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "medium" }}>
              {t("common.error")}
            </Typography>
            <Typography variant="body2">{error}</Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => window.location.reload()}
              >
                {t("common.tryAgain")}
              </Button>
            </Box>
          </Paper>
        ) : workouts.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.05
              )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <Box sx={{ mb: 2 }}>
              <FitnessCenterIcon
                sx={{
                  fontSize: 60,
                  color: alpha(theme.palette.text.primary, 0.3),
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: "medium" }}>
              {t("workout.noWorkouts")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t("workout.startTracking")}
            </Typography>
            <Button
              variant="contained"
              onClick={handleAddWorkout}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: `0 10px 20px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
              }}
            >
              {t("workout.addWorkout")}
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {workouts
              .sort(
                (a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()
              )
              .slice(0, 6)
              .map((workout, index) => (
                <Zoom
                  in={true}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  key={workout.id}
                >
                  <Grid item xs={12} md={6}>
                    <WorkoutCard
                      workout={workout}
                      deleteWorkout={deleteWorkout}
                    />
                  </Grid>
                </Zoom>
              ))}
          </Grid>
        )}

        {workouts.length > 6 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/workouts")}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: "medium",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              {t("workout.viewAll")}
            </Button>
          </Box>
        )}
      </Container>

      {/* Боковое меню */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 280, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {t("common.menu")}
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            <ListItem
              button
              onClick={() => {
                navigate("/");
                setDrawerOpen(false);
              }}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <HomeIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={t("nav.home")} />
            </ListItem>

            <ListItem
              button
              onClick={handleProfile}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <AccountCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={t("nav.account")} />
            </ListItem>

            <ListItem
              button
              onClick={handleCalendar}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <CalendarMonthIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={t("nav.calendar")} />
            </ListItem>

            <ListItem
              button
              onClick={handleSettings}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <SettingsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={t("nav.settings")} />
            </ListItem>

            <ListItem
              button
              onClick={handleGymOptions}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <BusinessCenterIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={t("nav.gym")} />
            </ListItem>

            {isAuthenticated ? (
              <ListItem
                button
                onClick={handleLogout}
                sx={{ borderRadius: 2, mb: 1 }}
              >
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText
                  primary={t("auth.logout")}
                  sx={{ color: theme.palette.error.main }}
                />
              </ListItem>
            ) : (
              <ListItem
                button
                onClick={handleLogin}
                sx={{ borderRadius: 2, mb: 1 }}
              >
                <ListItemIcon>
                  <LogoutIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={t("auth.login")} />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Диалоговое окно опций фитнес-зала */}
      <Dialog
        open={gymDialogOpen}
        onClose={handleCloseGymDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            backgroundImage: `linear-gradient(135deg, ${alpha(
              theme.palette.background.paper,
              0.95
            )} 0%, ${theme.palette.background.paper} 100%)`,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "#fff",
            py: 2,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {t("gym.fitnessGymOptions")}
            </Typography>
            <IconButton onClick={handleCloseGymDialog} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GroupIcon />}
                onClick={handleGroupWorkouts}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  justifyContent: "flex-start",
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <Box textAlign="left">
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {t("gym.groupWorkouts")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("gym.manageGroupWorkouts")}
                  </Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PersonIcon />}
                onClick={handleMembers}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  justifyContent: "flex-start",
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <Box textAlign="left">
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {t("gym.members")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("gym.manageMembers")}
                  </Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<TimelineIcon />}
                onClick={handleAnalytics}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  justifyContent: "flex-start",
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <Box textAlign="left">
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {t("gym.analytics")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("gym.viewAnalytics")}
                  </Typography>
                </Box>
              </Button>
            </Grid>
          </Grid>

          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              {t("gym.promoteYourGym")}
            </Typography>
            <Typography variant="body2" paragraph>
              {t("gym.promoteGymDescription")}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1.5,
                backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              }}
            >
              {t("gym.getPremium")}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Плавающие кнопки с обновленным дизайном */}
      <Fab
        color="primary"
        aria-label="add-workout"
        sx={{
          position: "fixed",
          bottom: 90,
          right: 24,
          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
          backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: "white",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
          },
        }}
        onClick={handleAddWorkout}
      >
        <AddIcon />
      </Fab>

      <Fab
        color="secondary"
        aria-label="gym-options"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.3)}`,
          backgroundImage: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
          color: "white",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: `0 12px 24px ${alpha(
              theme.palette.secondary.main,
              0.4
            )}`,
          },
        }}
        onClick={handleGymOptions}
      >
        <BusinessCenterIcon />
      </Fab>
    </Box>
  );
};

export default HomePage;
