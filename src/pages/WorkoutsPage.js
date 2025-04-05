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
  IconButton,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  FitnessCenter as FitnessCenterIcon,
  Sort as SortIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import WorkoutCard from "../components/WorkoutCard";
import moment from "moment";
import "moment/locale/ru";
import { WORKOUT_TYPES, WORKOUT_LABELS } from "../types/workout";

const WorkoutsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { workouts, loading, error, deleteWorkout } = useWorkout();
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("date-desc"); // По умолчанию сортировка по дате (новые в начале)

  // Настраиваем локаль moment
  moment.locale(i18n.language === "ru" ? "ru" : "en");

  // Фильтрация и сортировка тренировок при изменении данных
  useEffect(() => {
    if (!workouts || workouts.length === 0) {
      setFilteredWorkouts([]);
      return;
    }

    let result = [...workouts];

    // Фильтрация по поисковому запросу
    if (searchTerm) {
      result = result.filter(
        (workout) =>
          workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (workout.notes &&
            workout.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Фильтрация по типу тренировки
    if (selectedType) {
      result = result.filter((workout) => workout.type === selectedType);
    }

    // Сортировка с использованием moment
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return moment(a.date).diff(moment(b.date));
        case "date-desc":
          return moment(b.date).diff(moment(a.date));
        case "duration-asc":
          return a.duration - b.duration;
        case "duration-desc":
          return b.duration - a.duration;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return moment(b.date).diff(moment(a.date));
      }
    });

    setFilteredWorkouts(result);
  }, [workouts, searchTerm, selectedType, sortBy]);

  const handleAddWorkout = () => {
    navigate("/workout");
  };

  const handleDeleteWorkout = async (id) => {
    await deleteWorkout(id);
  };

  const handleViewWorkout = (workout) => {
    // В будущем можно добавить детальный просмотр тренировки
    console.log("View workout:", workout);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("");
  };

  // Группировка тренировок по месяцам для отображения с использованием moment
  const groupWorkoutsByMonth = () => {
    if (!filteredWorkouts.length) return {};

    const grouped = {};

    filteredWorkouts.forEach((workout) => {
      const monthKey = moment(workout.date).format("MMMM YYYY");

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(workout);
    });

    return grouped;
  };

  const groupedWorkouts = groupWorkoutsByMonth();

  // Получаем переведенное название типа тренировки
  const getWorkoutTypeLabel = (type) => {
    return t(`workout.workoutTypes.${type}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("home.myWorkouts")}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddWorkout}
          sx={{
            backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            borderRadius: "12px",
            px: 3,
            py: 1.2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            "&:hover": {
              boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {t("workout.newWorkout")}
        </Button>
      </Box>

      {/* Фильтры и поиск */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            placeholder={t("common.search")}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              minWidth: "200px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {WORKOUT_TYPES.map((type) => (
              <Chip
                key={type}
                label={getWorkoutTypeLabel(type)}
                clickable
                color={selectedType === type ? "primary" : "default"}
                onClick={() =>
                  setSelectedType(selectedType === type ? "" : type)
                }
                icon={<FitnessCenterIcon />}
                sx={{
                  borderRadius: "8px",
                  px: 0.5,
                  "&.MuiChip-colorPrimary": {
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  },
                }}
              />
            ))}

            <IconButton
              onClick={clearFilters}
              color="primary"
              sx={{ ml: 1 }}
              title={t("common.clearFilters")}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper
          sx={{
            p: 3,
            borderRadius: "16px",
            textAlign: "center",
            backgroundColor: alpha(theme.palette.error.light, 0.1),
            color: theme.palette.error.main,
          }}
        >
          <Typography variant="h6">{t("common.error")}</Typography>
          <Typography variant="body2">{error}</Typography>
        </Paper>
      ) : filteredWorkouts.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            borderRadius: "16px",
            textAlign: "center",
            backgroundColor: alpha(theme.palette.info.light, 0.1),
          }}
        >
          <FitnessCenterIcon
            sx={{
              fontSize: 60,
              color: alpha(theme.palette.text.secondary, 0.5),
              mb: 2,
            }}
          />
          <Typography variant="h6">{t("home.noWorkouts")}</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddWorkout}
            sx={{
              mt: 3,
              backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              borderRadius: "12px",
            }}
          >
            {t("workout.newWorkout")}
          </Button>
        </Paper>
      ) : (
        <Box>
          {Object.keys(groupedWorkouts).map((month) => (
            <Box key={month} sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  gap: 1,
                }}
              >
                <CalendarIcon color="primary" />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {month}
                </Typography>
                <Chip
                  label={groupedWorkouts[month].length}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                  }}
                />
              </Box>

              <Grid container spacing={3}>
                {groupedWorkouts[month].map((workout) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={workout._id || workout.id}
                  >
                    <WorkoutCard
                      workout={workout}
                      onDelete={() =>
                        handleDeleteWorkout(workout._id || workout.id)
                      }
                      onClick={() => handleViewWorkout(workout)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      {/* Подпись разработчика */}
      <Box
        sx={{
          textAlign: "center",
          mt: 6,
          pt: 3,
          pb: 2,
          color: alpha(theme.palette.text.secondary, 0.7),
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        }}
      >
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          Developed by Iusif Mamedov
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Premium Fitness App
        </Typography>
      </Box>
    </Container>
  );
};

export default WorkoutsPage;
