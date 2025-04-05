const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  updateMe,
  updatePassword,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

// Публичные маршруты
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Защищенные маршруты
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
