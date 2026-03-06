import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CallIcon from '@mui/icons-material/Call';
import "./popup.css";
import CallPage from "./CallPage.jsx";
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(0),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(0),
    
  },
}));

export default function Popup({getRemoteUserId , setConnectPopup}){
  const navigate = useNavigate();
  const [openCall , setOpenCall] = React.useState(false);

  const handleVideoCall = async()=> {
    try{
      const res = await axios.get("http://localhost:8080/api/verify",{withCredentials:true});
      if(res.data.status){

      setOpenCall(true);
    } else{
      navigate("/login");
    }
    } catch(err){
      navigate("/login");
    }
    
    
  }
    
   console.log( "remote user id " , getRemoteUserId);
  return (
    <>
    {openCall? <CallPage isCaller={true} getRemoteUserId={getRemoteUserId} setOpenCall={setOpenCall} setConnectPopup={setConnectPopup}/>:
    <React.Fragment>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open}
      >

       
        <IconButton
         onClick={() => setConnectPopup(false)}
          aria-label="close"
          sx={(theme) => ({
            position: 'absolute',
            right: 0,
            top: 0,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon/>
        </IconButton>
        <DialogContent dividers style={{ backgroundColor:"#001223ee", color:"#E6E6E6" , padding:"50px 25px 15px 25px", border:"1px solid #908e8ebf", borderRadius:"15px"}}>
          <Typography gutterBottom component="div">
          <div className="call-selector-box">
            
             <div className="call" onClick={handleVideoCall}>
                <VideoCallIcon style={{backgroundColor:"#1d2f41eb" , borderRadius:"50%" , padding:"5px"}}/><span>Video call</span>
                </div>
           
             
                 <div className="call" style={{opacity:"0.5",cursor:"not-allowed"}}><CallIcon style={{backgroundColor:"#1d2f41eb" , borderRadius:"50%" , padding:"5px"}}/><span>Audio call</span>
                 </div>

                    <div className="call"><ChatIcon style={{backgroundColor:"#1d2f41eb" , borderRadius:"50%" , padding:"5px"}}/><span>Chat</span>
                 </div>
          </div>
                
            
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
}
    </>
  )
}