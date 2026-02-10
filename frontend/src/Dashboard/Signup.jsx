import "./signup.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { NavLink } from "react-router-dom";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import LanguageSelector from "./LanguageSelector.jsx";
import axios from 'axios';
import {  toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [seePass, setSeePass] = useState("password");
  const [isSee, setIsSee] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState([]);
  const [click, setClick] = useState(false);
  

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleName = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleClick = () => {
    setClick(!click);
  };
  const handleLanguage = (e) => {
    setLanguage(e);
  };
  const handleSumbit = async(e) => {
    e.preventDefault();

    try{
      //console.log(language, email, password, username);
    const res = await axios.post(
      "http://localhost:8080/api/signup",
      { email, username, password, language },
      { withCredentials: true },
    );

    setEmail("");
    setUsername("");
    setPassword("");
    setLanguage([]);
     toast.success(res.data.msg);
      if(res.data.status){
        navigate('/');
      }
  
    } catch(err){
      toast.error(err.response.data.msg);
    }
   
  };
  return (
    <div className="signup-body">
      
      {click ? (
        <LanguageSelector
          handleLanguage={handleLanguage}
          handleClick={handleClick}
        />
      ) : null}
      <div className="signup-card ">
        <NavLink to={"/"} className="cancel-signup" style={{ color: "white" }}>
          <CloseIcon />
        </NavLink>
        <AccountCircleIcon sx={{ fontSize: "3rem" }} />
        <h2>Sign Up</h2>
        <p>Enter your personal details to create an account.</p>

        <form action="" onSubmit={handleSumbit}>
          <div className="login-inputs">
            <input
              className="input-field"
              value={email}
              onChange={handleEmail}
              type="email"
              name="email"
              id=""
              placeholder="Enter email..."
            />

            <div className="password ">
              <input
                className="input-field-password"
                type={seePass}
                value={password}
                onChange={handlePassword}
                name="email"
                id=""
                placeholder="Enter password..."
              />
              {isSee ? (
                <VisibilityIcon
                  onClick={() => {
                    setIsSee(!isSee);
                    setSeePass("password");
                  }}
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() => {
                    setIsSee(!isSee);
                    setSeePass("text");
                  }}
                />
              )}
            </div>
          </div>

          <div className="native-lang-selector">
            <input
              className="username"
              value={username}
              onChange={handleName}
              type="text"
              name="username"
              id=""
              placeholder="Enter name..."
            />
            <Button
              variant="contained"
              className="lang-selector"
              onClick={handleClick}
              startIcon={<RecordVoiceOverIcon />}
            >
              Language
            </Button>
          </div>
        </form>

        <br />
        <Button
          variant="contained"
          className="signup-btn2"
          onClick={handleSumbit}
        >
          Signup
        </Button>

        <h3 className="no-account">
          Already have an account? &nbsp;
          <NavLink
            to={"/login"}
            style={{
              textDecoration: "none",
              color: "#5F9598",
              fontWeight: "650",
            }}
          >
            Login.
          </NavLink>
        </h3>
      </div>
    </div>
  );
}
