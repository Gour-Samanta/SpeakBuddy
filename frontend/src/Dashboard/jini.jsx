import Vapi from "@vapi-ai/web";
import { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import "./jini.css";

export default function Jini({ setOpenCall }) {
  const vapiRef = useRef(null);

//   useEffect(() => {
//       // Initialize Vapi when the component mounts
//       vapiRef.current = new Vapi(`${import.meta.env.VITE_VAPI_API_KEY}`);
//       vapiRef.current.start(`${import.meta.env.VITE_VAPI_ASS_ID}`);

//       // Clean up Vapi when the component unmounts
//       return () => {
//         vapiRef.current?.stop();
//       }},[]);

  const endJiniCall = () => {
    vapiRef.current?.stop();
    setOpenCall(false);
  };

  return (
    <div className="jini-call">
      <div className="jini-call-inner">
        <video
          src="https://res.cloudinary.com/df6qahoph/video/upload/v1777710134/download-reverse-videoboltnet_7kxq1N9O_online-video-cutter.com_wbychz.mp4"
          autoPlay
          loop
          className="animated-ai-voice"
        ></video>
        <Button variant="outlined" color="error" onClick={endJiniCall}>
          End
        </Button>
      </div>
    </div>
  );
}
