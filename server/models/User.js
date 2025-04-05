const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false, // Не возвращать пароль по умолчанию
  },
  // Настройки пользователя
  settings: {
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "dark",
    },
    language: {
      type: String,
      enum: ["en", "ru"],
      default: "ru",
    },
    units: {
      type: String,
      enum: ["metric", "imperial"],
      default: "metric",
    },
    showCalories: {
      type: Boolean,
      default: true,
    },
    showTimer: {
      type: Boolean,
      default: true,
    },
    // Можно добавить другие настройки
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Хешировать пароль перед сохранением
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Метод для проверки пароля
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Метод для генерации токена JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = mongoose.model("User", UserSchema);
