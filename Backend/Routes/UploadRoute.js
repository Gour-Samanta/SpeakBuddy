const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel.js");

const upload = require("../Middleware/ImageUpload.js");

router.patch("/update-image/:id" , upload.single('image'), async(req,res)=>{
    const {id} = req.params;
    console.log("dp update ",id);
    if(!req.file){
        return res.status(400).json({msg:"no file upload"});
    }
    try{
        const updatedUser = await User.findByIdAndUpdate({_id:id} , {image:req.file.path},{ new: true });

        res.json({msg:"image update successfully" ,data: updatedUser});
    } catch(e){
        console.log("something went wrong!");
        
    }
    
});

module.exports = router;