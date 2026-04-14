import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useEffect } from "react";
import axios from "axios";
import "./chat.css";
import SendIcon from "@mui/icons-material/Send";
import { useRef } from "react";
import { socket } from "../Socket/Socket.js";
import LockIcon from '@mui/icons-material/Lock';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//#001223eb
export default function Chat({ setChatOpen, getRemoteUserId, userId }) {
  const endChatRef = useRef(null);
  const [userData, setUserData] = React.useState({});
  const [message, setMessage] = React.useState("");
  const [userChat, setUserChat] = React.useState([]);

  //retrive user past chats
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/chats/api/${userId}/${getRemoteUserId}`,
      )
      .then((res) => {
        console.log("actual data from db : ", res.data); //[{_id: , senderId: , receiverId: , message: , timeStamp: , ]
        const chats = res.data.map((chat) => ({
          id: chat.senderId,
          msg: chat.message,
          key: chat._id,
        }));
        setUserChat(chats);
        console.log("after modify data   : ", chats);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/users/find/chat?id=${getRemoteUserId}`,
        { withCredentials: true },
      )
      .then((res) => {
        setUserData(res.data);
      });
  }, []);
  // console.log(userData);
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const keyRef = useRef(0);
  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (message.length === 0) {
      return;
    }
    keyRef.current += 1;
    setUserChat((prev) => [
      ...prev,
      { id: userId, msg: message, key: keyRef.current },
    ]);

    socket.emit("send-messages", {
      senderId: userId,
      receiverId: getRemoteUserId,
      message: message,
      sender: userId,
      receiver: getRemoteUserId,
    });

    setMessage("");
  };
  useEffect(() => {
    socket.on("receive-message", (data) => {
      console.log(data);
      const { message, senderId } = data;
      if (senderId === getRemoteUserId) {
        keyRef.current += 1;
        setUserChat((prev) => [
          ...prev,
          { id: userData.id, msg: message, key: keyRef.current },
        ]);
      }
      socket.emit("markAsRead", {
        senderId: senderId,
      });
    });

    return () => socket.off("receive-message");
  }, [getRemoteUserId, userData]);

  useEffect(() => {
    socket.emit("markAsRead", {
      senderId: getRemoteUserId,
    });

    return () => socket.off("markAsRead");
  }, []);

  useEffect(() => {
    endChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userChat]);

  return (
    <>
      <React.Fragment>
        <Dialog
          fullScreen
          open={true}
          slots={{
            transition: Transition,
          }}
          PaperProps={{
            sx: {
              background: "linear-gradient(#0B141A,#111B21)",
              color: "#fff",
            },
          }}
        >
          <AppBar
            className="chat-topbar"
            style={{ background: "linear-gradient(#0B141A,#111B21)" }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setChatOpen(false)}
                aria-label="close"
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <Typography
                sx={{
                  ml: 1,
                  flex: 1,
                  display: "flex",
                  columnGap: "10px",
                  alignItems: "center",
                }}
                variant="h6"
                component="div"
              >
                <img src={userData.image} alt="" className="remote-user-dp" />
                {userData.username}
              </Typography>
            </Toolbar>
          </AppBar>
            
          <div className="chats-container">
   {userChat.length == 0? <h5 style={{position:"fixed" , color:"#eeeeee91"}}><LockIcon sx={{fontSize:"18px"}}/> Chats are only stored for 5 days.</h5>:null}
            <div className="main-chats-sec">
              {userChat.map((ele) => {
                return (
                  <div
                  
                    className={`chat-container ${ele.id === userId ? "right" : "left"}`}
                    key={ele.key}
                  >
                   
                    <img
                      src={userData.image}
                      alt=""
                      className="remote-user-dp"
                    />
                    <span
                      className={`${ele.id === userId ? "chats-me" : "chats-you"}`}
                    >
                      {" "}
                      {ele.msg}
                    </span>
                  </div>
                );
              })}
              <div ref={endChatRef}></div>
            </div>
          </div>

          <div className="msg-box-parent">
            <div className="msg-box">
              <form
                action=""
                className="msg-form"
                onSubmit={handleSubmitMessage}
              >
                <input
                  type="text"
                  name=""
                  className="msg-field"
                  value={message}
                  onChange={handleMessageChange}
                />
                <button
                  type="submit"
                  className="send-msg-btn"
                  onClick={handleSubmitMessage}
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    </>
  );
}
