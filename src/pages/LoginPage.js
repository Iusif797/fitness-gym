import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
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
  IconButton,
  InputAdornment,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const LoginPage = () => {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setFormErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (tab === 1) {
      // Регистрация
      if (!formData.name) {
        errors.name = t("auth.nameRequired");
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = t("auth.passwordMismatch");
        isValid = false;
      }
    }

    if (!formData.email) {
      errors.email = t("auth.emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t("auth.invalidEmail");
      isValid = false;
    }

    if (!formData.password) {
      errors.password = t("auth.passwordRequired");
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = t("auth.passwordLength");
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (tab === 0) {
        // Вход
        result = await login(formData.email, formData.password);
      } else {
        // Регистрация
        result = await register(
          formData.name,
          formData.email,
          formData.password
        );
      }

      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.background.paper,
              0.95
            )} 0%, ${theme.palette.background.paper} 100%)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <FitnessCenterIcon
              sx={{
                fontSize: 48,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Fitness Tracker
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {tab === 0 ? t("auth.welcomeBack") : t("auth.createAccount")}
            </Typography>
          </Box>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 4 }}
          >
            <Tab label={t("auth.login")} />
            <Tab label={t("auth.register")} />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {tab === 1 && (
              <TextField
                fullWidth
                label={t("auth.name")}
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              fullWidth
              label={t("auth.email")}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label={t("auth.password")}
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {tab === 1 && (
              <TextField
                fullWidth
                label={t("auth.confirmPassword")}
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                sx={{ mb: 2 }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 4px 10px ${alpha(
                  theme.palette.primary.main,
                  0.25
                )}`,
                "&:hover": {
                  boxShadow: `0 6px 15px ${alpha(
                    theme.palette.primary.main,
                    0.35
                  )}`,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : tab === 0 ? (
                t("auth.login")
              ) : (
                t("auth.register")
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/")}
                sx={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {t("auth.continueWithout")}
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
