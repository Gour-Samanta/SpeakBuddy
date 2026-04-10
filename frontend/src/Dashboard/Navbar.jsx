import "./navbar.css";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import UserAcc from "./UserAcc.jsx";
import Badge from "@mui/material/Badge";
import Skeleton from "@mui/material/Skeleton";

export default function Navbar({ setIsLogged }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/verify`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoggedIn(res.data.status);
        setData([
          res.data.username,
          res.data.language,
          res.data.image,
          res.data.id,
        ]);
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  console.log("isLoggedIn", isLoggedIn);

  // if(loading) return (<div className="loading-nav"></div>);

  return (
    <div className="navbar-nav">

       <div className="navbar-logo">
        {loading ? (
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={200}
          height={30}
          sx={{
            bgcolor: "#1f293a42 !important",
            borderRadius:"5px"
          }}
        />
      ) : (
       <div className="logo-container"> 
       <img src="../logo.png" alt="" />
              <div className="logo-right">
                <h1 className="logo-name">SpeakBuddy</h1>
                <div className="logo-name-bottom">Improve Your Speaking..</div>
              </div>
          </div>
         
       
      )}
       </div>
      

      <div className="login-btn">
        {loading ? (
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
            sx={{
              bgcolor: "#1f293a42   !important",
            }}
          />
        ) : (
          <div>
            {isLoggedIn ? (
              <Badge color="success" variant="dot" badgeContent=" ">
                <UserAcc
                  data={data}
                  setData={setData}
                  setIsLoggedIn={setIsLoggedIn}
                  setIsLogged={setIsLogged}
                />
              </Badge> //passing setIsLoggedIn is impt so that after logout // the isLoggedIn state value change & reRender happend
            ) : (
              <NavLink to={"/login"}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<LoginIcon className="login-icon" />}
                  className="login-btn"
                >
                  Login
                </Button>
              </NavLink>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
