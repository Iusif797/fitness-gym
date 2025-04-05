import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Container,
  Link,
} from "@mui/material";

const LoginPage = () => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, register, isLoading, error } = useAuth();
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (tab === 1) {
      // Регистрация
      if (!formData.name) {
        tempErrors.name = "Имя обязательно";
        isValid = false;
      }

      if (formData.password !== formData.passwordConfirm) {
        tempErrors.passwordConfirm = "Пароли не совпадают";
        isValid = false;
      }
    }

    if (!formData.email) {
      tempErrors.email = "Email обязателен";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Некорректный email";
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = "Пароль обязателен";
      isValid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = "Пароль должен содержать минимум 6 символов";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (tab === 0) {
        // Вход
        await login(formData.email, formData.password);
      } else {
        // Регистрация
        await register(formData.name, formData.email, formData.password);
      }
      navigate("/");
    } catch (err) {
      console.error("Form submit error:", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Fitness Tracker
          </Typography>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab label="Вход" />
            <Tab label="Регистрация" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {tab === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Имя"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete={tab === 0 ? "current-password" : "new-password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
            />

            {tab === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="passwordConfirm"
                label="Подтверждение пароля"
                type="password"
                id="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                error={!!errors.passwordConfirm}
                helperText={errors.passwordConfirm}
                sx={{ mb: 2 }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : tab === 0 ? (
                "Войти"
              ) : (
                "Зарегистрироваться"
              )}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/")}
                underline="hover"
              >
                Продолжить без входа
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
