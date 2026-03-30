const Chat = require("../Models/ChatsModel.js");


module.exports.UserChatsControllers = async(req,res)=>{
    const {sender , receiver} = req.params;

   try{
     const allChats = await Chat.find({
        $or:[
            {senderId:sender , receiverId:receiver},
            {senderId:receiver , receiverId:sender}
        ]
    }).sort({timestamp:1});
    res.json(allChats);
    
   } catch(err){
    console.log(err);
   }
}


