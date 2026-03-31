require('dotenv').config();
const User = require("../Models/UserModel.js");
const jwt = require("jsonwebtoken");

module.exports.IsLoggedIn =async(req,res ,next)=>{
    try{
        const token = req.cookies.token;
        console.log(token);
    if(!token){
        return res.status(401).json({status:false});
        
    }

    const decode = jwt.verify(token , process.env.TOKEN_KEY );
       
        const user = await User.findById(decode.id);
        if(!user) {
            return res.status(401).json({status:false});
        }

        req.user = user;
        next();
    
    } catch(err){
        
        return res.status(403).json({status:false });
        
    }
}