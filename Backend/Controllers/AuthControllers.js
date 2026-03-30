const User = require('../Models/UserModel.js');
const validator = require('validator');
const {createSecretToken} = require('../Utils/createSecretToken.js');
const bcrypt = require("bcryptjs");

// =========> Sign Up <============

module.exports.Signup = async(req,res)=>{
    try{
        const {email , username , password , language} = req.body;

    if(!email || !username || !password || !language) {
        return res.status(400).json({msg: "enter all details" , status:false});
    }

    if(!validator.isEmail(email)){   //validator check is email format valid or not.
        return res.status(400).json({msg:"wrong email format." , status:false});
    }


    const existUser = await User.findOne({email});  //check if user exist or not
    if(existUser){
        return res.status(409).json({msg:"Email already Exist!" , status:false});  //409 - conflicts
    }

  
    const user = new User({email , username , password , language});
    await user.save();     //save the user into DB

    const token = createSecretToken(user._id);
    res.cookie("token" , token , {
        httpOnly:true,
        secure:true,
        sameSite:"None",
        maxAge: 21*24*60*60*1000,
    });
    res.status(200).json({msg:"signup successfull" , status:true});

    } catch(err){
        console.log(err);
        res.status(500).json({msg:"server error" , status:false});
    }
}

//========>Login<==========

module.exports.Login = async(req,res)=>{

   try{
     const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({msg:"please fill all boxes" , status:false});
    }
    console.log(email);
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({msg:"user not exists!" , status:false});
    }

    const isMatch = await bcrypt.compare(password , user.password);    //compare current password with stored password
    if(!isMatch){
        return res.status(400).json({msg:"wrong password." , status:false});
    }

    const token = createSecretToken(user._id);  //generate a secrate token based on user id;
    res.cookie("token" , token , {
        httpOnly:true,
        maxAge:21*24*60*60*1000,
        sameSite:"None",
        secure:true,
    });
    res.status(200).json({msg:"user login successfully." , status:true});

   } catch(err){
    console.log(err);
    res.status(500).json({msg:"server error." , status:false})
   }
}

//=========>Logout<========
module.exports.Logout =(req,res)=>{
    res.clearCookie("token" ,{
        httpOnly:true,
        sameSite:"None",
        secure:true,
    });
    res.json({msg:"user logout!." , status:true});
}