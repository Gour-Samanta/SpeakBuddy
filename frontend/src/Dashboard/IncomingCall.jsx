import "./callpage.css";
import Button from '@mui/material/Button';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useState } from "react";
import {cleanUp, rejectCall} from "../WebRTC/webrtc.js";


export default function IncomingCall({incomingCall , receiveCall, setIncomingCall}){      //callId , from , offer

    const [callPopup , setCallPopup] = useState(true);

    const declineCall=()=>{
        rejectCall(incomingCall.callId , incomingCall.from);
        cleanUp();
        setIncomingCall(null);
        setCallPopup(false);
        
        
    }
    return(
        <> 
        {callPopup? 
         <div className="incoming-call-notify">
            <h3 style={{fontWeight:"400"}}>Talkmate calling...</h3>
            <div>
            <Button variant="contained" color="error" onClick={declineCall}><CallEndIcon/></Button> &nbsp;&nbsp;
            <Button variant="contained" color="success" onClick={receiveCall}><CallIcon/></Button>
            </div>
        </div> : null}
        </>
      
    )
}