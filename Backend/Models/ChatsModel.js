const mongoose = require("mongoose");
const User = require("./UserModel");

const ChatSchema = new mongoose.Schema({
  senderId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  receiverId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  message: String,
  isRead: {
    type: Boolean,
    default: false,
  },
  
  timeStamp: {
    type: Date,
    default: Date.now,
    expires: 60*60*24*5,
  },
});
const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
