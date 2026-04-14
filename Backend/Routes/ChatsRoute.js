const {UserChatsControllers , connectUsersList} = require("../Controllers/UserChatsControllers.js");
const express = require("express");
const router = express.Router();


router.get("/api/:sender/:receiver" , UserChatsControllers);
router.get("/users-chat" , connectUsersList);

module.exports = router;