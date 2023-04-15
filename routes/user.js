const express = require("express");
const { getUser, postEditUser } = require("../controllers/user");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get('/user/:userId', isAuth, getUser);
router.put('/user/:userId', isAuth, postEditUser);

module.exports = router;