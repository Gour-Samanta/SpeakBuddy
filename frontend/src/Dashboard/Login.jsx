import "./login.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { NavLink } from "react-router-dom";
import axios from "axios";
import {  toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';




export default function Login({setIsLogged}) {
  const navigate = useNavigate();
    const [seePass , setSeePass] = useState('password');
    const [isSee , setIsSee] = useState(false);


    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');

    const handleEmail = (e)=>{
        setEmail(e.target.value);
    }
     const handlePassword = (e)=>{
        setPassword(e.target.value);
    }
   const handleSumbit = async(e)=>{
    e.preventDefault();
    try{
      const res = await axios.post("http://localhost:8080/api/login" , {email , password} ,{withCredentials:true});
      toast.success(res.data.msg);
      setIsLogged(true);
      navigate('/');

    } catch(err){
      toast.error(err.response.data.msg);
    }
    
   }
  return (
    <div className="login-body">
      <div className="login-card ">
        <NavLink to={'/'} className="cancel-login" style={{color:"white"}}>
          <CloseIcon/>
        </NavLink>
        <AccountCircleIcon sx={{ fontSize: "3rem" }} />
        <h2>Welcome back!</h2>
        <p>Good to see you again.</p>

        <form action="" onSubmit={handleSumbit}>
          
           <div className="login-inputs">
             <input className="input-field" value={email} onChange={handleEmail} type="email" name="email" id="" placeholder="Enter email..."/>

            <div className="password "><input className="input-field-password" type={seePass} value={password} onChange={handlePassword} name="email" id="" placeholder="Enter password..." />
            {isSee? <VisibilityIcon onClick={()=>{setIsSee(!isSee); setSeePass('password') }}/> : <VisibilityOffIcon onClick={()=>{setIsSee(!isSee); setSeePass('text')}}/>}
            </div>
           </div>

         
            
          
        </form>
        
        <br />
       
          <Button variant="contained" className="login-btn2" onClick={handleSumbit}>
            Login
          </Button>
        
        <h3 className="no-account">Don't have an account? &nbsp;  
          <NavLink to={'/signup'} style={{textDecoration:"none", color:"#5F9598" , fontWeight:"650"}}>
          signup now.
          </NavLink>
         
        </h3>
      </div>
    </div>
  );
}
