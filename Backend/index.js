require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AuthRoute = require("./Routes/AuthRoute.js");
const FindUsersRoute = require("./Routes/FindUsersRoute.js");

// socket.io
const { createServer } = require('node:http');
const server = createServer(app);
const {initSocket} = require("./Socket/Socket.js");
initSocket(server);


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
    }
));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DB connected.");
})

//auth
app.use("/api" , AuthRoute);

//find users
app.use("/api/users" , FindUsersRoute);



let PORT = process.env.PORT || 8080;
server.listen(PORT ,"0.0.0.0", (req,res)=>{    //server.listen : so that express & socket.io work on same port 
    console.log(`server is listing on port : ${PORT}`)
})