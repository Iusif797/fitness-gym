import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, alpha } from "@mui/material/styles";
import { useWorkout } from "../context/WorkoutContext";
import { useAuth } from "../context/AuthContext";
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
  Divider,
  Avatar,
  Grid,
  CircularProgress,
  useMediaQuery,
  Paper,
  Grow,
  Zoom,
  Fab,
  Tooltip,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  CalendarMonth as CalendarIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Whatshot as WhatshotIcon,
  Timer as TimerIcon,
  FitnessCenter as FitnessCenterIcon,
  DirectionsRun as DirectionsRunIcon,
  ArrowForward as ArrowForwardIcon,
  EmojiEvents as EmojiEventsIcon,
  Bolt as BoltIcon,
} from "@mui/icons-material";
import WorkoutCard from "../components/WorkoutCard";
import { format } from "date-fns";
import { ru, enUS } from "date-fns/locale";

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

  // Определяем локаль для форматирования даты
  const dateLocale = i18n.language === "ru" ? ru : enUS;

  // Обработка статистики пользователя
  useEffect(() => {
    if (workouts.length > 0) {
      // Общее количество тренировок
      const totalWorkouts = workouts.length;

      // Тренировки за текущий месяц
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonth = workouts.filter((workout) => {
        const workoutDate = new Date(workout.date);
        return (
          workoutDate.getMonth() === currentMonth &&
          workoutDate.getFullYear() === currentYear
        );
      }).length;

      // Подсчет streak (последовательных дней)
      let streakDays = 0;
      // TODO: Реализовать подсчет streakDays

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

  const handleCalendar = () => {
    // Функционал календаря
    console.log("Calendar clicked");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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

  // Вычисляем цвета для градиентов в зависимости от темы
  const gradientStart = theme.palette.mode === "dark" ? "#2D3748" : "#E6F7FF";
  const gradientEnd = theme.palette.mode === "dark" ? "#1A202C" : "#BBE1FA";
  const highlightColor = theme.palette.primary.main;

  // Рассчитываем прогресс для прогресс-баров
  const monthProgress =
    userStats.thisMonth > 0
      ? Math.min(100, (userStats.thisMonth / 20) * 100)
      : 0; // Предположим, цель - 20 тренировок в месяц

  const streakProgress =
    userStats.streakDays > 0
      ? Math.min(100, (userStats.streakDays / 7) * 100)
      : 0; // Предположим, цель - 7 дней подряд

  // Рендер боковой панели
  const sidebarContent = (
    <Box
      sx={{
        width: 300,
        height: "100%",
        background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
    >
      {/* Декоративные элементы */}
      <Box
        sx={{
          position: "absolute",
          top: -80,
          left: -80,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            highlightColor,
            0.2
          )} 0%, rgba(0,0,0,0) 70%)`,
          zIndex: 0,
          animation: "pulse 15s infinite ease-in-out",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.2)" },
            "100%": { transform: "scale(1)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 100,
          right: -100,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            highlightColor,
            0.1
          )} 0%, rgba(0,0,0,0) 70%)`,
          zIndex: 0,
          animation: "float 20s infinite ease-in-out",
          "@keyframes float": {
            "0%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-20px)" },
            "100%": { transform: "translateY(0)" },
          },
        }}
      />

      {/* Шапка */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          mb: 2,
        }}
      >
        {isAuthenticated ? (
          <>
            <Avatar
              sx={{
                width: 90,
                height: 90,
                bgcolor: alpha(theme.palette.primary.main, 0.9),
                fontSize: "2rem",
                fontWeight: "bold",
                mb: 2,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                border: `3px solid ${theme.palette.background.paper}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
                },
              }}
              onClick={handleProfile}
            >
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                color: theme.palette.mode === "dark" ? "#fff" : "#333",
                textShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              {t("common.welcome")}, {user?.name}!
            </Typography>
            <Box
              sx={{
                mt: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ opacity: 0.7, textAlign: "center" }}
              >
                {t("home.lastLogin")}:{" "}
                {format(new Date(), "PPP", { locale: dateLocale })}
              </Typography>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              background: `linear-gradient(135deg, ${alpha(
                highlightColor,
                0.1
              )} 0%, ${alpha(theme.palette.background.paper, 0.2)} 100%)`,
              borderRadius: 2,
              backdropFilter: "blur(8px)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("auth.notLoggedIn")}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{
                borderRadius: "12px",
                py: 1.2,
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                },
              }}
            >
              {t("auth.login")}
            </Button>
          </Box>
        )}
      </Box>

      {/* Основное меню */}
      <List
        sx={{
          px: 2,
          py: 1,
          flex: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        <ListItem
          button
          onClick={() => {
            setDrawerOpen(false);
            navigate("/");
          }}
          sx={{
            borderRadius: 3,
            mb: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateX(5px)",
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            },
            p: 1.5,
          }}
        >
          <ListItemIcon>
            <HomeIcon
              sx={{
                color: highlightColor,
                fontSize: "1.8rem",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={t("home.home")}
            primaryTypographyProps={{
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          />
        </ListItem>

        <ListItem
          button
          onClick={handleSettings}
          sx={{
            borderRadius: 3,
            mb: 1.5,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateX(5px)",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
            },
            p: 1.5,
          }}
        >
          <ListItemIcon>
            <SettingsIcon
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.6)",
                fontSize: "1.8rem",
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={t("settings.settings")}
            primaryTypographyProps={{
              fontWeight: "medium",
              fontSize: "1.1rem",
            }}
          />
        </ListItem>

        {isAuthenticated && (
          <>
            <ListItem
              button
              onClick={handleCalendar}
              sx={{
                borderRadius: 3,
                mb: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateX(5px)",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
                },
                p: 1.5,
              }}
            >
              <ListItemIcon>
                <CalendarIcon
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(0,0,0,0.6)",
                    fontSize: "1.8rem",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={t("home.calendar")}
                primaryTypographyProps={{
                  fontWeight: "medium",
                  fontSize: "1.1rem",
                }}
              />
            </ListItem>

            <ListItem
              button
              onClick={handleProfile}
              sx={{
                borderRadius: 3,
                mb: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateX(5px)",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
                },
                p: 1.5,
              }}
            >
              <ListItemIcon>
                <PersonIcon
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(0,0,0,0.6)",
                    fontSize: "1.8rem",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={t("auth.profile")}
                primaryTypographyProps={{
                  fontWeight: "medium",
                  fontSize: "1.1rem",
                }}
              />
            </ListItem>
          </>
        )}
      </List>

      {/* Нижняя часть */}
      <Box
        sx={{
          p: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        {isAuthenticated && (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              mb: 3,
              borderRadius: "12px",
              py: 1.2,
              textTransform: "none",
              fontWeight: "medium",
              borderWidth: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                borderWidth: 2,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                transform: "translateY(-2px)",
              },
            }}
          >
            {t("auth.logout")}
          </Button>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <IconButton
            onClick={handleThemeToggle}
            sx={{
              bgcolor: theme.palette.background.paper,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              color: highlightColor,
              width: 45,
              height: 45,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "rotate(30deg)",
                bgcolor: alpha(highlightColor, 0.1),
              },
            }}
          >
            {theme.palette.mode === "dark" ? (
              <LightModeIcon />
            ) : (
              <DarkModeIcon />
            )}
          </IconButton>
          <Typography
            variant="caption"
            display="block"
            sx={{
              mt: 1.5,
              opacity: 0.6,
              textAlign: "center",
              fontWeight: "medium",
            }}
          >
            {t("common.appName")} v1.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  // Основное содержимое
  const mainContent = (
    <Container
      maxWidth="lg"
      sx={{
        mt: 2,
        mb: 4,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Grow in={true} timeout={800}>
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            backgroundImage: `linear-gradient(120deg, ${alpha(
              highlightColor,
              0.1
            )} 0%, ${alpha(highlightColor, 0.05)} 100%)`,
            backgroundSize: "cover",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              backgroundImage:
                'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              mixBlendMode: "overlay",
            }}
          />

          <CardContent
            sx={{ position: "relative", py: 4, px: { xs: 3, md: 5 } }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                mb: 4,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                    backgroundImage: `linear-gradient(90deg, ${
                      theme.palette.text.primary
                    } 0%, ${alpha(theme.palette.text.primary, 0.7)} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {isAuthenticated && user
                    ? t("common.hello", { name: user.name })
                    : t("common.welcome")}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ mb: 1, color: alpha(theme.palette.text.primary, 0.7) }}
                >
                  {format(new Date(), "d MMMM yyyy, EEEE", {
                    locale: dateLocale,
                  })}
                </Typography>

                {isAuthenticated && (
                  <Chip
                    size="small"
                    icon={<BoltIcon fontSize="small" />}
                    label={
                      userStats.streakDays > 0
                        ? `${userStats.streakDays} ${t("home.streakDays")}`
                        : t("common.today")
                    }
                    sx={{
                      bgcolor:
                        userStats.streakDays > 3
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.primary.main, 0.1),
                      color:
                        userStats.streakDays > 3
                          ? theme.palette.success.main
                          : theme.palette.primary.main,
                      mt: 1,
                    }}
                  />
                )}
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddWorkout}
                sx={{
                  mt: { xs: 2, md: 0 },
                  backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  borderRadius: "24px",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {t("home.newWorkout")}
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                justifyContent: "center",
              }}
            >
              <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                <Card
                  sx={{
                    minWidth: { xs: "100%", sm: "200px" },
                    flexGrow: 1,
                    borderRadius: 3,
                    background: theme.palette.background.paper,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    overflow: "visible",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      transition: "transform 0.3s ease",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        width: 56,
                        height: 56,
                        mb: 2,
                        mx: "auto",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      <FitnessCenterIcon />
                    </Avatar>
                    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                      {userStats.totalWorkouts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("home.totalWorkouts")}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>

              <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                <Card
                  sx={{
                    minWidth: { xs: "100%", sm: "200px" },
                    flexGrow: 1,
                    borderRadius: 3,
                    background: theme.palette.background.paper,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    overflow: "visible",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      transition: "transform 0.3s ease",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        width: 56,
                        height: 56,
                        mb: 2,
                        mx: "auto",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      <CalendarIcon />
                    </Avatar>
                    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                      {userStats.thisMonth}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("home.thisMonth")}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={monthProgress}
                      sx={{
                        mt: 2,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        "& .MuiLinearProgress-bar": {
                          bgcolor: theme.palette.info.main,
                          borderRadius: 3,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Zoom>

              <Zoom in={true} style={{ transitionDelay: "300ms" }}>
                <Card
                  sx={{
                    minWidth: { xs: "100%", sm: "200px" },
                    flexGrow: 1,
                    borderRadius: 3,
                    background: theme.palette.background.paper,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    overflow: "visible",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      transition: "transform 0.3s ease",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        width: 56,
                        height: 56,
                        mb: 2,
                        mx: "auto",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      <WhatshotIcon />
                    </Avatar>
                    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                      {userStats.streakDays}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("home.streakDays")}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={streakProgress}
                      sx={{
                        mt: 2,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        "& .MuiLinearProgress-bar": {
                          bgcolor: theme.palette.success.main,
                          borderRadius: 3,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Zoom>
            </Box>
          </CardContent>
        </Paper>
      </Grow>

      {/* Заголовок и карточки тренировок */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            "&::before": {
              content: '""',
              display: "inline-block",
              width: 4,
              height: 24,
              bgcolor: theme.palette.primary.main,
              borderRadius: 4,
              mr: 2,
            },
          }}
        >
          {t("home.myWorkouts")}
        </Typography>
      </Box>

      {/* Карточки тренировок */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 8,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress size={50} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            {t("common.loading")}
          </Typography>
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : workouts.length > 0 ? (
        <Grid container spacing={3}>
          {workouts
            .slice()
            .reverse()
            .map((workout, index) => (
              <Grow
                in={true}
                timeout={500 + index * 100}
                key={workout._id || workout.id}
              >
                <Grid item xs={12} sm={6} md={4}>
                  <WorkoutCard
                    workout={workout}
                    onDelete={() => deleteWorkout(workout._id || workout.id)}
                    onClick={() =>
                      navigate(`/workout/${workout._id || workout.id}`)
                    }
                  />
                </Grid>
              </Grow>
            ))}
        </Grid>
      ) : (
        <Paper
          sx={{
            py: 8,
            px: 4,
            textAlign: "center",
            borderRadius: 4,
            bgcolor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.primary.main, 0.05)
                : alpha(theme.palette.primary.main, 0.02),
            border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <FitnessCenterIcon
            sx={{
              fontSize: 60,
              color: alpha(theme.palette.text.secondary, 0.3),
              mb: 2,
            }}
          />
          <Typography variant="h6" gutterBottom color="text.secondary">
            {t("home.noWorkouts")}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddWorkout}
            sx={{
              mt: 3,
              borderRadius: "24px",
              px: 3,
            }}
          >
            {t("home.newWorkout")}
          </Button>
        </Paper>
      )}
    </Container>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Верхняя панель */}
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 70,
          display: "flex",
          alignItems: "center",
          px: 3,
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(90deg, ${alpha(
                  theme.palette.background.paper,
                  0.8
                )} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
              : `linear-gradient(90deg, ${alpha(
                  theme.palette.background.paper,
                  0.9
                )} 0%, ${theme.palette.background.paper} 100%)`,
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FitnessCenterIcon sx={{ color: theme.palette.primary.main }} />
          {t("common.appName")}
        </Typography>

        {!isMobile && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title={t("settings.settings")}>
              <IconButton
                color="inherit"
                onClick={handleSettings}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={
                theme.palette.mode === "dark"
                  ? t("settings.lightTheme")
                  : t("settings.darkTheme")
              }
            >
              <IconButton
                color="inherit"
                onClick={handleThemeToggle}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                {theme.palette.mode === "dark" ? (
                  <LightModeIcon />
                ) : (
                  <DarkModeIcon />
                )}
              </IconButton>
            </Tooltip>

            {isAuthenticated ? (
              <Avatar
                onClick={handleProfile}
                sx={{
                  cursor: "pointer",
                  bgcolor: theme.palette.primary.main,
                  "&:hover": {
                    boxShadow: "0 0 0 2px " + theme.palette.primary.main,
                  },
                }}
              >
                {user?.name.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Button
                variant="contained"
                onClick={handleLogin}
                sx={{
                  borderRadius: "24px",
                  px: 2,
                }}
              >
                {t("auth.login")}
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Боковая панель */}
      <Drawer
        variant={isMobile ? "temporary" : "temporary"}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            boxShadow: "0 0 30px rgba(0,0,0,0.2)",
            width: { xs: "85%", sm: 320 },
            borderTopRightRadius: "2rem",
            borderBottomRightRadius: "2rem",
            border: "none",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Основное содержимое */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: "90px",
          pb: "20px",
          minHeight: "100vh",
          bgcolor: theme.palette.background.default,
        }}
      >
        {mainContent}
      </Box>

      {/* Подпись разработчика */}
      <Box
        sx={{
          position: "fixed",
          bottom: 10,
          right: 15,
          zIndex: 10,
          opacity: 0.7,
          fontSize: "0.7rem",
          color: theme.palette.text.secondary,
          fontStyle: "italic",
          fontWeight: 500,
          textAlign: "right",
          "&:hover": {
            opacity: 1,
          },
        }}
      >
        Developed by Iusif Mamedov
        <Box
          component="span"
          sx={{
            display: "block",
            fontSize: "0.65rem",
            mt: 0.5,
          }}
        >
          Premium Fitness App
        </Box>
      </Box>

      {/* Плавающая кнопка добавления тренировки */}
      <Zoom
        in={true}
        timeout={500}
        style={{
          transitionDelay: "500ms",
        }}
      >
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            "&:hover": {
              boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
          onClick={handleAddWorkout}
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default HomePage;
