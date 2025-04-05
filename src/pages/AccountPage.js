import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";

const AccountPage = () => {
  const { user, isLoading, error, updateUser, updatePassword, logout } =
    useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

  // Если пользователь не авторизован - перенаправляем на вход
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    });
    setSuccess("");
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setPasswordErrors({
      ...passwordErrors,
      [e.target.name]: "",
    });
    setPasswordSuccess("");
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name) {
      newErrors.name = "Имя обязательно";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email обязателен";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Некорректный email";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Текущий пароль обязателен";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "Новый пароль обязателен";
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Пароль должен содержать минимум 6 символов";
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
      isValid = false;
    }

    setPasswordErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateUser(formData);
      setSuccess("Профиль успешно обновлен");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    try {
      await updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setPasswordSuccess("Пароль успешно обновлен");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error updating password:", err);
    }
  };

  const handleDeleteAccount = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // TODO: Добавить API для удаления аккаунта
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
    }
    setOpenDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleBack = () => {
    navigate("/");
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
            Профиль
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Личные данные
          </Typography>

          <TextField
            fullWidth
            label="Имя"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Сохранить
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {passwordSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {passwordSuccess}
          </Alert>
        )}

        <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Изменить пароль
          </Typography>

          <TextField
            fullWidth
            label="Текущий пароль"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.currentPassword}
            helperText={passwordErrors.currentPassword}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Новый пароль"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.newPassword}
            helperText={passwordErrors.newPassword}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Подтвердите новый пароль"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.confirmPassword}
            helperText={passwordErrors.confirmPassword}
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Сменить пароль
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Опасная зона
          </Typography>

          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAccount}
          >
            Удалить аккаунт
          </Button>
        </Box>

        <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
          <DialogTitle>Удаление аккаунта</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя
              отменить. Все ваши данные будут удалены.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Отмена</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Удалить
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AccountPage;
