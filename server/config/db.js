const mongoose = require("mongoose");
require("dotenv").config(); // Чтобы process.env работал здесь

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Устарело в новых версиях mongoose
      // useFindAndModify: false, // Устарело
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);

    // В продакшене экстренно выходим при ошибке подключения
    if (process.env.NODE_ENV === "production") {
      console.error("MongoDB connection error. Exiting application");
      process.exit(1);
    } else {
      console.warn(
        "MongoDB connection failed, but continuing in development mode"
      );
    }
  }
};

module.exports = connectDB;
