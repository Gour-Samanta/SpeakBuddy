import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import CallEndIcon from "@mui/icons-material/CallEnd";
import Tooltip from "@mui/material/Tooltip";

import "./callpage.css";
import { useEffect, useRef } from "react";
import { CreatePeer, AnswerCall, callEnd } from "../WebRTC/webrtc.js";
import { socket } from "../Socket/Socket.js";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(0),
  },
}));

export default function Callpage({
  // open,
  isCaller,
  getRemoteUserId,
  incomingCall, // { callId, fromUserId, offer }
  setOpenCall,
  setConnectPopup,
  
}) {

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);



  /* =========================
     START CALL
  ========================== */
  useEffect(()=>{
      if (isCaller && getRemoteUserId) {
      // CALLER FLOW
      CreatePeer(getRemoteUserId, localVideoRef, remoteVideoRef);
      
    }
  },[isCaller,getRemoteUserId]);
  
  useEffect(() => {

    if (!isCaller && incomingCall) {
      // RECEIVER FLOW
      AnswerCall(
        incomingCall.callId,
        incomingCall.fromUserId,
        incomingCall.offer,
        localVideoRef,
        remoteVideoRef,
       
      );
    }
  }, [incomingCall]);

  // =========================
  // END CALL
  // ==========================
  const cutCall = () => {
    callEnd();   //goes to server then server cut both call
    setOpenCall(false);
    setConnectPopup(false);
  };
 

  /* =========================
     HANDLE REJECT / END
  ========================== */
  useEffect(() => {
    socket.on("call-rejected", cutCall);
    socket.on("call-ended", cutCall);

    return () => {
      socket.off("call-rejected", cutCall);
      socket.off("call-ended", cutCall);
    };
  }, []);

  
  // NOT RECEIVE use setTimeout


  return (
    <BootstrapDialog open={open}>
      <DialogContent
        style={{
          backgroundColor: "#001223eb",
          color: "#E6E6E6",
          padding: "50px 15px 15px 30px",
        }}
      >
        <Typography component="div">
          <div className="call-container">
            {" "}
            <div className="call-box">
              {" "}
              <div className="video-call-main-sec">
                {" "}
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="local-video"
                />{" "}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="remote-video"
                />{" "}
              </div>{" "}
              <div className="call-footer">
                {" "}
                <Tooltip title="End call" placement="top">
                  {" "}
                  <div className="end-call" onClick={cutCall}>
                    {" "}
                    <CallEndIcon />{" "}
                  </div>{" "}
                </Tooltip>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        </Typography>
      </DialogContent>
    </BootstrapDialog>
  );
}
