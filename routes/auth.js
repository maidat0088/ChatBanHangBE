const express = require("express");
const { check } = require("express-validator");
const User = require("../models/user");
const { postLogin, postSignup } = require("../controllers/auth");

const router = express.Router();

router.post(
  "/login",
  postLogin
);
router.post(
  "/signup",
  [
    check("name").isString().withMessage("Please enter user name").trim(),
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .custom( async (value) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    check("password", "Please enter a strong password")
      .isStrongPassword()
      .trim(),
  ],
  postSignup
);

module.exports = router;
