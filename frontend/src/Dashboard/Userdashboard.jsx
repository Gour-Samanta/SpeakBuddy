import "./userDashboard.css";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {  toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

export default function Userdashboard({ data ,setIsLoggedIn, setClickUserAcc }) {
    const navigate = useNavigate();

    //data[3] = "https://cdn.pixabay.com/photo/2024/02/08/12/54/ai-generated-8561072_1280.png"
  const userIMG = data[3] || "./defaultDP.webp";  // default img or user uploaded img

  const handleLogout =async()=>{
   try{
     const res = await axios.get("http://localhost:8080/api/logout" , {withCredentials:true});
     setIsLoggedIn(false);     // the func will trigger & component rerender
    toast.success(res.data.msg);  
     navigate("/");      //navigate to home 
  
   } catch(e){
    console.log(e);
   }
  }

  return (
    <div className="user-dashboard">
        <CloseIcon className="user-dashboard-close" onClick={()=>{setClickUserAcc(false)}}/>
        <div className="user-img">
        <img src={userIMG} alt="" className="user-img" />
        <AddAPhotoIcon/>
        </div>
      <h4 className="user-name">{data[0]}</h4>

        <RecordVoiceOverIcon/>
      <h4 className="user-language">
        {data[1].map((ele) => {
          return <div className="lang" key={ele}>{ele}</div>;
        })}
       </h4>

         <Button color="error" variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
        Logout
      </Button>

    </div>
  );
}
