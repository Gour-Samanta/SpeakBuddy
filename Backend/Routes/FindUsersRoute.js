const {FindUsers, FindUser} = require("../Controllers/FindUsersControllers.js");
const express = require("express");
const router = express.Router();


router.get("/find" , FindUsers);
router.get("/find/chat" , FindUser);

module.exports = router;
