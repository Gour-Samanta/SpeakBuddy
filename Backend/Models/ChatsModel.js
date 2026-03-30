const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
    {
        senderId : String,
        receiverId :String,
        message:String,
        timeStamp:
            {
                type:Date,
                default:Date.now,
            }
    }
);
const Chat = mongoose.model("Chat" , ChatSchema);
module.exports = Chat;