import { useEffect, useRef, useState } from "react";
import "./hero.css";
import Button from "@mui/material/Button";
import axios from "axios";
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import Badge from "@mui/material/Badge";
import Popup from "./Popup.jsx";
import Navbar from "./Navbar.jsx";
import {socket} from "../Socket/Socket.js";
import IncomingCall from "./IncomingCall.jsx";
import Callpage from "./CallPage.jsx";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatPage from "./ChatPage.jsx";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';



export default function Hero({allOnlineUsers, setIsLogged, isLogged , userId}) {
  const newMsgCount = useRef(0);


  const [usersData, setUsersData] = useState([]);
  const [connectPopup , setConnectPopup] = useState(false);
  const [getRemoteUserId , setGetRemoteUserId] = useState('');
  const [incomingCall , setIncomingCall] = useState(null);
  const [openCallRec , setOpenCallRec] = useState(false);
  const [isOpenChatPage ,setIsOpenChatPage ] = useState(false);
  const [msgCount , setMsgCount] = useState(newMsgCount.current);
  


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

  
  console.log(allOnlineUsers);

  const getUsers = async (language) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/users/find?lang=${language}`,
      { withCredentials: true },
    );
    setUsersData(res.data.users);
  };
  const findLanguage = (lang) => {
    console.log(lang);
    getUsers(lang);


  };

  useEffect(()=>{
    console.time("API");
    axios.get(
      `${import.meta.env.VITE_API_URL}/api/users/find?lang=All`,
      { withCredentials: true },
    ).then((res)=>{
      console.timeEnd("API");
        setUsersData(res.data.users);
        
    })
  },[])
//   console.log(usersData);
const openCallOption = (id)=>{
  setConnectPopup(!connectPopup);
  setGetRemoteUserId(id);
}
  

  useEffect(()=>{
    socket.on("incoming-call", (data)=>{   //callId, from , offer
      setIncomingCall(data);
      // console.log("incoming call : " , data);
    });
  },[]);

  useEffect(()=>{
  socket.on("call-ended" ,({reason})=>{ 
  console.log("call ended " , reason);
  setIncomingCall(null);
  });
  },[]);

  const receiveCall=()=>{
    setOpenCallRec(true);
  }

  useEffect(()=>{
    socket.on("receive-message" , ({message , senderId})=>{
      newMsgCount.current = newMsgCount.current+1;
      setMsgCount(newMsgCount.current);
    });
  },[])


  return (
    <>
    {openCallRec? <Callpage isCaller={false} incomingCall={incomingCall} setOpenCall={setOpenCallRec} setConnectPopup={setConnectPopup}/>:null}
    {incomingCall? <IncomingCall incomingCall={incomingCall} receiveCall={receiveCall} setIncomingCall={setIncomingCall}/>:null}
    <Navbar setIsLogged={setIsLogged}/>   
    
    {connectPopup? <Popup getRemoteUserId={getRemoteUserId} setConnectPopup={setConnectPopup} userId={userId} /> : null}
      <div className="main">
        <h2 className="hero">Language Exchange Network</h2>
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


        <div className="gini-mobile" onClick={()=>{alert("Currently unavailable, please try again later.\n\nThank you.");}}>
          <div style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            columnGap:"4px"
          }}>
            <AutoAwesomeIcon/>
            <p>Hii!👋 I'm your Ai partner.</p>
          </div>
        </div>

    
      <div className="users-container">
        {usersData.length == 0 ? (
          <h4 style={{ margin: "auto" , display:"flex" , flexDirection:"column" , justifyContent:'center' , alignItems:"center"}}><SentimentVeryDissatisfiedIcon style={{fontSize:"3rem"}}/> Sorry, No user Found!</h4>
          
        ) : (
          usersData.map((ele) => {
            return (
              <div className="user-card" key={ele.email}>
                
                <div className="user-nav-bar">
                {allOnlineUsers.includes(ele._id)?  <Badge color="success" variant="dot">
                    <img src={ele.image} alt="" />
                  </Badge>:   <Badge color="error" variant="dot">
                    <img src={ele.image} alt="" />
                  </Badge>}
          
                  <div className="user-nav">
                    <span style={{ fontWeight: "700", color: "#a0a0a0" }}>
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
                  <Button variant="outlined" color="success" style={{ textTransform: 'none' }} onClick={()=>{openCallOption(ele._id)}}>
                    <PhoneEnabledIcon fontSize="small"/> Connect and talk now!
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>




         {isOpenChatPage? <ChatPage setIsOpenChatPage={setIsOpenChatPage} /> : null}
      {isLogged? <Badge badgeContent={msgCount} color="error" className="message" onClick={()=>{setIsOpenChatPage(true);}}>
        <ChatBubbleIcon />
       
      </Badge>: null}
      
        <div className="gini-box" onClick={()=>{alert("Currently unavailable, please try again later.\n\nThank you.");}}>
          <div className="gini-intro"><AutoAwesomeIcon/> &nbsp; Hello! </div>
           <img className="gini" src="../image.png" alt="" />
        </div>
       
       
        
    </>
  );
}
