import { useEffect, useRef, useState } from "react";
import "./hero.css";
import Button from "@mui/material/Button";
import axios from "axios";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import Badge from "@mui/material/Badge";
import Popup from "./Popup.jsx";
import Navbar from "./Navbar.jsx";
import { socket } from "../Socket/Socket.js";
import IncomingCall from "./IncomingCall.jsx";
import Callpage from "./CallPage.jsx";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChatPage from "./ChatPage.jsx";
import ChatIcon from "@mui/icons-material/Chat";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Tooltip from "@mui/material/Tooltip";

export default function Hero({
  allOnlineUsers,
  setIsLogged,
  isLogged,
  userId,
}) {
  const newMsgCount = useRef(0);

  const [usersData, setUsersData] = useState([]);
  const [connectPopup, setConnectPopup] = useState(false);
  const [getRemoteUserId, setGetRemoteUserId] = useState("");
  const [incomingCall, setIncomingCall] = useState(null);
  const [openCallRec, setOpenCallRec] = useState(false);
  const [isOpenChatPage, setIsOpenChatPage] = useState(false);
  const [msgCount, setMsgCount] = useState(newMsgCount.current);
  const [getRemoteUserIdMsg ,setGetRemoteUserIdMsg ] = useState({});

  let langRef = useRef("All");

  const languages = [
    { id: 0, name: "All" },
    { id: 1, name: "English" },
    { id: 2, name: "Bengali" },
    { id: 3, name: "Hindi" },
    { id: 4, name: "Tamil" },
    { id: 5, name: "Spanish" },
    { id: 6, name: "Russion" },
    { id: 7, name: "Punjabi" },
    { id: 8, name: "French" },
    { id: 9, name: "German" },
    { id: 10, name: "Japanese" },
    { id: 11, name: "Marathi" },
    { id: 12, name: "Odia" },
    { id: 13, name: "Nepali" },
    { id: 14, name: "Urdu" },
  ];

  console.log("all online users - " ,allOnlineUsers);

  const getUsers = async (language) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/users/find?lang=${language}`,
      { withCredentials: true },
    );
    
    let data = res.data.users;
    setUsersData(() => {
      let map = new Map();
      for(let i=0 ; i<data.length ; i++){
        map.set(data[i]._id , data[i]);
      }

      let newData = [];
      for(let i =0;i<allOnlineUsers.length ; i++){
          if(map.has(allOnlineUsers[i])){
            newData.unshift(map.get(allOnlineUsers[i]));
            map.delete(allOnlineUsers[i]);
          } 
      }


        for(let val of map.values()){
        newData.push(val);
      }

      return newData;
    }

    );
    

  };
  const findLanguage = (lang) => {
    langRef.current = lang;
    console.log(lang);
    getUsers(lang);
  };



  
 
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/find?lang=${langRef.current}`, {
        withCredentials: true,
      })
      .then((res) => {
    
        //========> allOnlineUsers on top Algo
      let data = res.data.users;
      setUsersData(() => {
      let map = new Map();
      for(let i=0 ; i<data.length ; i++){
        map.set(data[i]._id , data[i]);
      }

      let newData = [];
      for(let i =0;i<allOnlineUsers.length ; i++){
          if(map.has(allOnlineUsers[i])){
            newData.unshift(map.get(allOnlineUsers[i]));
            map.delete(allOnlineUsers[i]);
          } 
      }

      for(let val of map.values()){
        newData.push(val);
      }
      
      return newData;
    }

    );
        

      });
  }, [allOnlineUsers]);
  

  const openCallOption = (id) => {
    setConnectPopup(!connectPopup);
    setGetRemoteUserId(id);
  };

  useEffect(() => {
    socket.on("incoming-call", (data) => {
      //callId, from , offer
      setIncomingCall(data);
      // console.log("incoming call : " , data);
    });
  }, []);

  useEffect(() => {
    socket.on("call-ended", ({ reason }) => {
      console.log("call ended ", reason);
      setIncomingCall(null);
    });
  }, []);

  const receiveCall = () => {
    setOpenCallRec(true);
  };

  useEffect(() => {
    socket.on("receive-message", ({ message, senderId }) => {
      newMsgCount.current = newMsgCount.current + 1;
      setGetRemoteUserIdMsg({senderId, message});
      console.log("getRemoteUserIdMsg ", getRemoteUserIdMsg);
      setMsgCount(newMsgCount.current);
    });
  }, []);


  // console.log("user data " , usersData);



  return (
    <>
      {openCallRec ? (
        <Callpage
          isCaller={false}
          incomingCall={incomingCall}
          setOpenCall={setOpenCallRec}
          setConnectPopup={setConnectPopup}
        />
      ) : null}
      {incomingCall ? (
        <IncomingCall
          incomingCall={incomingCall}
          receiveCall={receiveCall}
          setIncomingCall={setIncomingCall}
        />
      ) : null}
      <Navbar setIsLogged={setIsLogged} />

      {connectPopup ? (
        <Popup
          getRemoteUserId={getRemoteUserId}
          setConnectPopup={setConnectPopup}
          userId={userId}
        />
      ) : null}
      <div className="main">
        <h2 className="hero">Language Exchange Network</h2>
      </div>

      <div
        className="gini-box"
        onClick={() => {
          alert("Currently unavailable, please try again later.\n\nThank you.");
        }}
      >
        <div className="gini-intro">
          <AutoAwesomeIcon /> &nbsp; Hello! meet your AI partner.
        </div>
      </div>

      <div className="language-filter">
        {languages.map((language) => {
          return (
            <Button
              variant="outlined"
              size="small"
              key={language.id}
              sx={{ textTransform: "none" }}
              onClick={() => {
                findLanguage(language.name);
              }}
            >
              {language.name}
            </Button>
          );
        })}
      </div>

      <div
        className="gini-mobile"
        onClick={() => {
          alert("Currently unavailable, please try again later.\n\nThank you.");
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            columnGap: "4px",
          }}
        >
          <AutoAwesomeIcon />
          <p>Hii!👋 I'm your Ai partner.</p>
        </div>
      </div>

      

      <div className="users-container">
        {usersData.length == 0 ? (
          <h4
            style={{
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SentimentVeryDissatisfiedIcon style={{ fontSize: "3rem" }} />{" "}
            Sorry, No user Found!
          </h4>
        ) : (
          usersData.map((ele) => {
            return (
              <div className="user-card" key={ele.email}>
                <div className="user-nav-bar">
                  {allOnlineUsers.includes(ele._id) ? (
                    <Badge color="success" variant="dot">
                      <img src={ele.image} alt="" />
                    </Badge>
                  ) : (
                    <Badge color="error" variant="dot">
                      <img src={ele.image} alt="" />
                    </Badge>
                  )}

                  <div className="user-nav">
                    <span style={{ fontWeight: "700", color: "#a0a0a0" }} className="name">
                      {ele.username}
                    </span>
                    <span style={{ color: "#b2b2b2" }}>
                      {ele.language.join(" + ")}
                    </span>
                  </div>
                </div>
                <div className="main-img">
                  <img src={ele.image} alt="" />
                </div>
                <div className="main-img">
                  <Button
                    variant="outlined"
                    color="success"
                    style={{ textTransform: "none" }}
                    onClick={() => {
                      openCallOption(ele._id);
                    }}
                  >
                    <PhoneEnabledIcon fontSize="small" /> Connect and talk now!
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isOpenChatPage ? (
        <ChatPage setIsOpenChatPage={setIsOpenChatPage} userId={userId}/>
      ) : null}

      {isLogged ? (
        <Badge
          badgeContent={msgCount}
          color="error"
          className="message"
          onClick={() => {
            setIsOpenChatPage(true);
            newMsgCount.current =0;
            setMsgCount(0);
          }}
        >
          <Tooltip title="New messages" placement="top">
            <ChatIcon />
          </Tooltip>
        </Badge>
      ) : null}
    </>
  );
}
