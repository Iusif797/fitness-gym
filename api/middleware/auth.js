const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: "Требуется авторизация" });
  }
};
