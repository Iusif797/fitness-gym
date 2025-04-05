const mongoose = require("mongoose");
require("dotenv").config(); // Чтобы process.env работал здесь

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Устарело в новых версиях mongoose
      // useFindAndModify: false, // Устарело
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    // Выход из процесса при ошибке подключения
    process.exit(1);
  }
};

module.exports = connectDB;
