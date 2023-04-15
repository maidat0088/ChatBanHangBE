const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const cookie = req.cookies;
  if (cookie) {
    const token = cookie.token;
    jwt.verify(token, "jwt-secret", (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại" });
      }
      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền truy cập" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Vui lòng đăng nhập trước" });
  }
};