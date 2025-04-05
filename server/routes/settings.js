const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settings");

const router = express.Router();

const { protect } = require("../middleware/auth");

// Защищаем все маршруты настроек
router.use(protect);

// Маршруты для работы с настройками
router.route("/").get(getSettings).put(updateSettings);

module.exports = router;
