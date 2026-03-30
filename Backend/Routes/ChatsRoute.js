const {UserChatsControllers} = require("../Controllers/UserChatsControllers.js");
const express = require("express");
const router = express.Router();

router.get("/api/:sender/:receiver" , UserChatsControllers);

module.exports = router;