import './App.css'
import Home from "./Dashboard/Home.jsx";
import Login from './Dashboard/Login.jsx';
import Signup from './Dashboard/Signup.jsx'
import {Routes , Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import {socket} from "./Socket/Socket.js";
import { useEffect, useState } from 'react';
import axios from 'axios';



function App() {

 const [allOnlineUsers , setAllOnlineUsers] = useState([]);
 const [isLogged , setIsLogged] = useState(false);
 const [userId , setUserId] = useState("");

   //socket
 useEffect(() => {
  const handleOnlineUsers = (onlineUsers) => {
    setAllOnlineUsers(onlineUsers);
  };

  socket.on("onlineUsers", handleOnlineUsers);

}, []);


  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_API_URL}/api/verify`,{withCredentials:true})
    .then((res)=>{
      console.log("after verify: " ,res.data);
      setUserId(res.data.id);
      if(res.data.status){
        socket.emit("user-connected" , res.data.id);
      }
      setIsLogged(true);
    });

  },[isLogged]);


  console.log("is logged ", isLogged);

  return (
    <>
    <ToastContainer position="top-right" autoClose={4000} />

      <Routes>
        <Route path='/*' element={<Home allOnlineUsers={allOnlineUsers} setIsLogged={setIsLogged} isLogged={isLogged} userId={userId}/>}/>
        <Route path='/login' element={<Login setIsLogged={setIsLogged}/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </>
  )
}

export default App
