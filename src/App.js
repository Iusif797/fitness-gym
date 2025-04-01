import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import HomePage from "./pages/HomePage";
import WorkoutPage from "./pages/WorkoutPage";
import StatisticsPage from "./pages/StatisticsPage";
import { WorkoutProvider } from "./context/WorkoutContext";

// Создаем темную тему для Material UI
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8C9EFF", // светлый фиолетово-синий цвет
    },
    secondary: {
      main: "#6EFFB1", // яркий аквамариновый
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#ffffff",
      secondary: "#B0B0B0",
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <WorkoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
          </Routes>
        </Router>
      </WorkoutProvider>
    </ThemeProvider>
  );
}

export default App;
