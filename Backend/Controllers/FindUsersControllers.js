require('dotenv').config();
const User = require("../Models/UserModel.js");
const jwt = require("jsonwebtoken");

module.exports.FindUsers = async(req,res)=>{
    let {lang} = req.query;
     const token = req.cookies.token;
    try{
        if(!token){
            let users;
            if(lang == "All"){
                users = await User.find({}).select("_id username language image").lean();
                // lean() returning plain JavaScript objects instead of heavy Mongoose Documents improve query performance
            }else{
                users = await User.find({language:lang}).select("_id username language image").lean();

                
            }
              return res.json({users})
            
        }
        const {id} = jwt.verify(token , process.env.TOKEN_KEY );
        //   const user = await User.findById(decode.id);

        if(lang === "All"){
             const users = await User.find({ _id : {$ne : id}}).select("_id username language image").lean();
             // lean() returning plain JavaScript objects instead of heavy Mongoose Documents improve query performance
             
             return res.json({users})
        }
        const users = await User.find({ _id : {$ne : id} ,language:lang}).select("_id username language image").lean();
        res.json({users});
    }catch(err){
        console.log(err);
    }
}
module.exports.FindUser = async(req,res)=>{
    let {id} = req.query;
    // console.log(id);
    try{
        const user = await User.findOne({_id:id}).select("_id username language image").lean();
        return res.json({id: user._id ,username:user.username ,language:user.language ,image:user.image});
      
    }catch(err){
        console.log(err);
    }
}