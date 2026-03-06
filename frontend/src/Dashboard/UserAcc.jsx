
import { useState } from "react";
import "./userAcc.css";
import Userdashboard from "./Userdashboard.jsx";

export default function UserAcc({data , setIsLoggedIn, setIsLogged }) {
  const [clickUserAcc, setClickUserAcc] = useState(false);

    const userIMG = data[3] || "./defaultDP.webp";



  return (
    <>
    { clickUserAcc ?<Userdashboard data={data} setIsLoggedIn={setIsLoggedIn} setClickUserAcc={setClickUserAcc} setIsLogged={setIsLogged}/>:null}

        
        <img src={userIMG} alt="user DP" className="userAcc"
          onClick={() => {
            setClickUserAcc(!clickUserAcc);
          }} />
      
    </>
  );
}


