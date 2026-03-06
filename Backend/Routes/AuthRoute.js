const express = require("express");
const router = express.Router();
const {IsLoggedIn} = require("../Middleware/AuthMiddleware.js");

const {Signup ,Login , Logout} = require("../Controllers/AuthControllers.js");


router.post("/signup" , Signup);
router.post("/login" , Login);
router.get("/logout" , Logout);

router.get("/verify" ,IsLoggedIn , (req,res)=>{
    res.json({status:true , username:req.user.username , language:req.user.language , id:req.user._id});
})

module.exports = router;