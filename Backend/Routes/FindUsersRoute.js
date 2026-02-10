const {FindUsers} = require("../Controllers/FindUsersControllers.js");
const express = require("express");
const router = express.Router();


router.get("/find" , FindUsers);

module.exports = router;
