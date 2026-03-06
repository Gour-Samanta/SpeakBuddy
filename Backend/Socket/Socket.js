
const { Server } = require("socket.io");

const onlineUsers = new Map();   // userId -> socketId
const activeCalls = new Map();   // callId -> { caller, receiver }

module.exports.initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
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
        from: socket.userId,
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





/*const { Server } = require("socket.io"); // Server is a class of socket.io
const onlineUsers = new Map();

module.exports.initSocket = (server) => {
  const io = new Server(server, {
    // io is the entire socket server which is a object
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // emit is used for send data && on is used for receive data.

  io.on("connection", (socket) => {
    //when socket.io-client load ,, it auto.. connect  .... socket is a specific client
    socket.on("user-connected", (userId) => {
      onlineUsers.set(userId , socket.id);  //store data in key , value pair
      console.log("🟢 connected : " ,userId , "socket_id: ", socket.id);
      socket.userId = userId;

      io.emit("onlineUsers" , Array.from(onlineUsers.keys())); // onlineUsers.Keys for iterate on keys
    });


    // Caller sends offer
  socket.on("call-user", data => {
    const receiverSocketId = onlineUsers.get(data.to);
    if(receiverSocketId){
       socket.to(receiverSocketId).emit("incoming-call", {
      from: socket.id,
      offer: data.offer
    });
    console.log("call-user -- " ,onlineUsers.get(data.to));
    } 
    else {
      console.log("user not online..");
    }
  });


// Receiver sends answer
  socket.on("accept-call", data => {
    socket.to(data.to).emit("call-accepted", {
      answer: data.answer
    });
  });

    // ICE candidate exchange
  socket.on("ice-candidate", data => {
    socket.to(data.to).emit("ice-candidate", {
      candidate: data.candidate
    });
  });


    socket.on("disconnect", () => {
      // socket => one user  BUT  io => all users
      console.log("🔴 disconnected : " ,socket.id );
      if(socket.userId){
        onlineUsers.delete(socket.userId);
        io.emit("onlineUsers" , Array.from(onlineUsers.keys()))
      }
    });
  });
};*/
