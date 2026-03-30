import "./navbar.css";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import UserAcc from "./UserAcc.jsx";
import Badge from "@mui/material/Badge";


export default function Navbar({setIsLogged}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading , setLoading] = useState(true);
  const [data , setData] = useState([]);


useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/verify`, { withCredentials: true })
      .then((res) => {
        setIsLoggedIn(res.data.status);
        setData([ res.data.username, res.data.language,res.data.image,res.data.id ]);
      })
      .finally(()=>{
        setLoading(false);
      })
  }, []);

 
console.log("isLoggedIn" , isLoggedIn);

  if(loading) return (<div className="loading-nav"></div>);

  return (
    <div className="navbar-nav">
      <div className="navbar-logo">
        <img src="../logo1.png" alt="" />
        <img src="../logo2.png" alt="" />
      </div>

      <div className="login-btn">
        {isLoggedIn ? (
          <Badge color="success" variant="dot" badgeContent=" ">
          <UserAcc data={data} setData={setData} setIsLoggedIn={setIsLoggedIn} setIsLogged={setIsLogged}/> 
        </Badge>    //passing setIsLoggedIn is impt so that after logout // the isLoggedIn state value change & reRender happend
                                                                      
        ) : (                                                
          <NavLink to={"/login"}>
            <Button variant="contained" size="small" startIcon={<LoginIcon className="login-icon" />} className="login-btn">
              Login
            </Button>
          </NavLink>
        )}
      </div>
    </div>
  );
}
