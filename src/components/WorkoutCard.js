import React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import {
  DeleteOutline,
  Edit,
  CalendarToday,
  Timer,
  LocalFireDepartment,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

// Цвета для разных типов тренировок
const workoutTypeColors = {
  strength: "#ff5722",
  cardio: "#2196f3",
  flexibility: "#4caf50",
  bodyweight: "#9c27b0",
  hiit: "#ff9800",
  weightlifting: "#e91e63",
  crossfit: "#795548",
  other: "#607d8b",
};

// Иконки для разных типов тренировок
const getWorkoutTypeIcon = (type) => {
  switch (type) {
    case "strength":
    case "weightlifting":
      return "💪";
    case "cardio":
      return "🏃";
    case "flexibility":
      return "🧘";
    case "bodyweight":
      return "🏋️";
    case "hiit":
      return "⚡";
    case "crossfit":
      return "🔄";
    default:
      return "🏆";
  }
};

// Названия типов тренировок
const workoutTypeLabels = {
  strength: "Силовая",
  cardio: "Кардио",
  flexibility: "Растяжка",
  bodyweight: "Свой вес",
  hiit: "HIIT",
  weightlifting: "Тяжелая атлетика",
  crossfit: "Кроссфит",
  other: "Другое",
};

const WorkoutCard = ({ workout, onDelete, onClick }) => {
  const theme = useTheme();

  // Форматирование даты
  const formattedDate = format(new Date(workout.date), "d MMMM yyyy", {
    locale: ru,
  });

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        position: "relative",
        overflow: "visible",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 5,
          transform: "translateY(-2px)",
          transition: "all 0.2s ease-in-out",
        },
      }}
      onClick={onClick}
    >
      {/* Тип тренировки */}
      <Box
        sx={{
          position: "absolute",
          top: -10,
          right: 16,
          bgcolor: workoutTypeColors[workout.type] || workoutTypeColors.other,
          color: "white",
          borderRadius: "20px",
          px: 2,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          boxShadow: 1,
        }}
      >
        <Typography variant="body2" component="span" sx={{ mr: 0.5 }}>
          {getWorkoutTypeIcon(workout.type)}
        </Typography>
        <Typography variant="body2" component="span">
          {workoutTypeLabels[workout.type] || workoutTypeLabels.other}
        </Typography>
      </Box>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Название и дата */}
        <Box sx={{ mb: 2, pt: 1 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            {workout.name || workoutTypeLabels[workout.type] || "Тренировка"}
          </Typography>
          <Box display="flex" alignItems="center">
            <CalendarToday
              fontSize="small"
              sx={{ color: "text.secondary", mr: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Информация о тренировке */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Timer fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {workout.duration} мин
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocalFireDepartment
              fontSize="small"
              sx={{ color: "text.secondary", mr: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary">
              {workout.calories} ккал
            </Typography>
          </Box>
        </Box>

        {/* Заметки */}
        {workout.notes && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              flexGrow: 1,
            }}
          >
            {workout.notes}
          </Typography>
        )}

        {/* Оборудование */}
        {workout.equipment && workout.equipment.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              mt: "auto",
              pt: 1,
            }}
          >
            {workout.equipment.map((item, index) => (
              <Chip
                key={index}
                label={item}
                size="small"
                sx={{
                  backgroundColor: theme.palette.action.selected,
                  fontSize: "0.7rem",
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>

      {/* Кнопки действий */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          display: "flex",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            if (
              window.confirm("Вы уверены, что хотите удалить эту тренировку?")
            ) {
              onDelete();
            }
          }}
          sx={{
            bgcolor: "background.paper",
            "&:hover": { bgcolor: "error.light", color: "white" },
            boxShadow: 1,
          }}
        >
          <DeleteOutline fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
};

export default WorkoutCard;
