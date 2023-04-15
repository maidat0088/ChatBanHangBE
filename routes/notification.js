const express = require("express");
const isAuth = require("../middleware/isAuth");
const { getNotification } = require("../controllers/notification");

const router = express.Router();

router.get('/notification', isAuth, getNotification);

module.exports = router;