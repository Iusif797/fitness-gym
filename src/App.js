import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { WorkoutProvider } from "./context/WorkoutContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import WorkoutPage from "./pages/WorkoutPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import SettingsPage from "./pages/SettingsPage";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import ThemeInitializer from "./components/ThemeInitializer";

// Защищенный маршрут компонент
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  // Определяем базовую тему на основе текущих настроек или системных предпочтений
  const currentTheme =
    document.documentElement.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  // Создаем тему MaterialUI
  const theme = createTheme({
    palette: {
      mode: currentTheme === "dark" ? "dark" : "light",
      primary: {
        main: currentTheme === "dark" ? "#bb86fc" : "#4a90e2",
        light: currentTheme === "dark" ? "#9e68fc" : "#64b5f6",
        dark: currentTheme === "dark" ? "#7c4dff" : "#1565c0",
        contrastText: "#ffffff",
      },
      secondary: {
        main: currentTheme === "dark" ? "#ff7043" : "#ef6c00",
        light: currentTheme === "dark" ? "#ffab91" : "#ff9800",
        dark: currentTheme === "dark" ? "#e64a19" : "#d84315",
        contrastText: "#ffffff",
      },
      background: {
        default: currentTheme === "dark" ? "#121212" : "#f5f5f5",
        paper: currentTheme === "dark" ? "#1e1e1e" : "#ffffff",
        secondary: currentTheme === "dark" ? "#2d2d2d" : "#eeeeee",
      },
      text: {
        primary: currentTheme === "dark" ? "#ffffff" : "#212121",
        secondary: currentTheme === "dark" ? "#cccccc" : "#555555",
        disabled: currentTheme === "dark" ? "#8c8c8c" : "#9e9e9e",
      },
    },
    typography: {
      fontFamily: '"Montserrat", "Roboto", "Arial", sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: currentTheme === "dark" ? "#121212" : "#f5f5f5",
            color: currentTheme === "dark" ? "#ffffff" : "#212121",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <WorkoutProvider>
            <ThemeInitializer>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/workout"
                  element={
                    <ProtectedRoute>
                      <WorkoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workouts"
                  element={
                    <ProtectedRoute>
                      <WorkoutsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </ThemeInitializer>
          </WorkoutProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
