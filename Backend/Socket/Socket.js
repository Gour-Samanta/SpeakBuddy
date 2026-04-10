require('dotenv').config();
const { Server } = require("socket.io");
const Chat = require("../Models/ChatsModel.js");

const onlineUsers = new Map();   // userId -> socketId
const activeCalls = new Map();   // callId -> { caller, receiver }

module.exports.initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: `${process.env.FRONTEND_URL}`,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 socket connected:", socket.id);

    // =========================
    // USER CONNECT
    // =========================
    socket.on("user-connected", (userId) => {
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);

      console.log("🟢 user online:", userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // =========================
    // CALL USER (SEND OFFER)
    // =========================
    socket.on("call-user", ({ callId, to, offer }) => {
      const receiverSocketId = onlineUsers.get(to);
      if (!receiverSocketId) return;

      activeCalls.set(callId, {
        caller: socket.id,
        receiver: receiverSocketId,
      });

      socket.to(receiverSocketId).emit("incoming-call", {
        callId,
        fromUserId: socket.userId,
        offer,
      });

      console.log("📞 call started:", callId);
    });

    // =========================
    // ACCEPT CALL (SEND ANSWER)
    // =========================
    socket.on("accept-call", ({ callId, to, answer }) => {
      const callerSocketId = onlineUsers.get(to);
      if (!callerSocketId) return;

      socket.to(callerSocketId).emit("call-accepted", {
        callId,
        answer,
      });

      console.log("✅ call accepted:", callId);
    });

    // =========================
    // ICE CANDIDATE
    // =========================
    socket.on("ice-candidate", ({ callId, candidate }) => {
      const call = activeCalls.get(callId);
      if (!call) return;

      const target =
        socket.id === call.caller ? call.receiver : call.caller;

      socket.to(target).emit("ice-candidate", { candidate });
    });

    // =========================
    // END CALL (HANGUP / TIMEOUT)
    // =========================
    socket.on("end-call", ({ callId, reason }) => {
      const call = activeCalls.get(callId);
      if (!call) return;

      io.to(call.caller).emit("call-ended", { reason });
      io.to(call.receiver).emit("call-ended", { reason });

      activeCalls.delete(callId);
      console.log("❌ call ended:", callId, reason);
    });

    // reject call
    socket.on("reject-call" , ({callId , to})=>{
      const getCallerSocketId = onlineUsers.get(to);
      if(!getCallerSocketId) return;

      socket.to(getCallerSocketId).emit("call-rejected" , {
        callId
      });
      activeCalls.delete(callId);
    })


    // =======================
    // CHATTING SECTION
    // =======================

    socket.on("send-messages" ,async(data)=>{
      const {senderId , receiverId, message , sender , receiver} = data;
      //data store at mongodb
      const newChat = new Chat({senderId , receiverId, message,sender , receiver });
      await newChat.save();

      const receiverSocketId = onlineUsers.get(receiverId);
      if(receiverSocketId){
        io.to(receiverSocketId).emit("receive-message",
          {
            message,
            senderId,
            
          }
        )
      }



    }
    )

    socket.on("markAsRead" , async({senderId})=>{
      await Chat.updateMany(
        {
          senderId:senderId,
          receiverId: socket.userId,
          isRead:false,
        },
        {
          isRead:true,
        }
      )
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      console.log("🔴 socket disconnected:", socket.id);

      // end active call if exists
      for (const [callId, call] of activeCalls.entries()) {
        if (call.caller === socket.id || call.receiver === socket.id) {
          io.to(call.caller).emit("call-ended", { reason: "disconnect" });
          io.to(call.receiver).emit("call-ended", { reason: "disconnect" });
          activeCalls.delete(callId);
        }
      }

      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      }
    });
  });
};

