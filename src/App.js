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
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import AccountPage from "./pages/AccountPage";

// Защищенный маршрут компонент
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Если идет проверка аутентификации, можно показать загрузку или ничего
  if (isLoading) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { user } = useAuth();

  // Создаем тему в зависимости от настроек пользователя
  const theme = createTheme({
    palette: {
      mode: user?.settings?.theme || "dark",
      primary: {
        main: "#2196f3",
      },
      secondary: {
        main: "#f50057",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WorkoutProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workout/:id?" element={<WorkoutPage />} />
          <Route path="/login" element={<LoginPage />} />
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
      </WorkoutProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
