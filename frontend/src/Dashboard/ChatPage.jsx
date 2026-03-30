import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {socket} from "../Socket/Socket.js";
import { useState, useEffect } from 'react';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//#001223eb
export default function ChatPage({setIsOpenChatPage}){
  const allUsersListRef = React.useRef([]);

  const [allUsersList , setAllUsersList] = useState([]);

    useEffect(()=>{
      socket.on("receive-message" , ({message , senderId})=>{
        if(!allUsersListRef.current.includes(senderId)){
          allUsersListRef.current.push(senderId);
          setAllUsersList([...allUsersListRef.current]);
          
        }
        
      });
    },[])

    

    return (
    <>
      <React.Fragment>
      <Dialog
        
        open={open}
        slots={{
          transition: Transition,
          
        }}
         PaperProps={{
    sx: {
      background: "linear-gradient(#0B141A,#111B21)",
      color: "#fff",
      width:"100%"
    }
    
  }}
  slotProps={{
    backdrop:{
      sx:{
        backdropFilter:"blur(4px)"
      }
    }
  }}
      >
        <AppBar sx={{ position: 'relative' }} style={{background: "linear-gradient(#0B141A,#111B21)"}}>
          <Toolbar  >
            <IconButton
              edge="start"
              color="inherit"
              onClick={()=> setIsOpenChatPage(false)}
              aria-label="close"
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Chats
            </Typography>
          </Toolbar>
        </AppBar>
        <List style={{padding:"5px", marginTop:"10px"}}>


          <ListItemButton style={{backgroundColor:"#1b262e", borderRadius:"15px", margin:"10px 0"}}>
            <AutoAwesomeIcon style={{backgroundImage:"linear-gradient(to right, rgba(182, 0, 232, 0.89), rgba(0, 232, 228, 0.89))"}}/>&nbsp;
            <ListItemText primary="Jini AI" style={{color:"rgb(28, 234, 172)"}}/>
          </ListItemButton>
            <ListItemButton style={{backgroundColor:"#1b262e", borderRadius:"15px"}}>
            <ListItemText primary="Vutu" />
          </ListItemButton>
          
         


        </List>
      </Dialog>
    </React.Fragment>
    </>
  )
}