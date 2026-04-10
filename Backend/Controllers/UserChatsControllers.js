const Chat = require("../Models/ChatsModel.js");
const mongoose = require("mongoose");


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

module.exports.connectUsersList = async(req,res)=>{
    let id = new mongoose.Types.ObjectId(req.query.userId);
    
    //using aggregation pipeline
    try{
        const data = await Chat.aggregate([
  {
    $match: {
      $or: [
        { senderId: id },
        { receiverId: id }
      ]
    }
  },

  //  create "other user" field
  {
    $addFields: {
      otherUser: {
        $cond: [
          { $eq: ["$senderId", id] },
          "$receiverId",
          "$senderId"
        ]
      }
    }
  },

  //  sort by latest first
  {
    $sort: { timeStamp: -1 }
  },

  //  group by other user 
  {
    $group: {
      _id: "$otherUser",
      lastMessage: { $first: "$message" },
      lastTime: { $first: "$timeStamp" },
      senderId: { $first: "$senderId" },
      receiverId: { $first: "$receiverId" },
      isRead:{$first:"$isRead"},
    }
  },

   {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $unwind: "$user"
  },

  // sort chat list
  {
    $sort: { lastTime: -1 }
  }
]);

res.json(data);

}catch(err){
        console.log(err);
    }
}


