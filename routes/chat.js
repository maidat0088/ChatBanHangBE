const express = require("express");
const isAuth = require("../middleware/isAuth");
const { getMessage } = require("../controllers/chat");

const router = express.Router();

router.get('/chat', isAuth, getMessage);


module.exports = router;