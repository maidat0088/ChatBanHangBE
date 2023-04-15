const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ message: errors.array()[0].msg });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).json({ message: "Sai email hoặc mật khẩu!" });
  }
  const doMatchPassword = await bcrypt.compare(password, user.password);
  if (doMatchPassword) {
    const token = jwt.sign(
      { email, userId: user._id.toString(), role: user.role },
      "jwt-secret"
    );

    return res.status(200).json({
      message: "Đăng nhập thành công!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
        accessToken: token,
      },
    });
  } else {
    return res.status(422).json({ message: "Sai email hoặc mật khẩu!" });
  }
};

exports.postSignup = async (req, res, next) => {
  const { email, password, name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: "user",
  });
  await user.save();
  return res.status(200).json({ message: "Đăng ký thành công!" });
};
