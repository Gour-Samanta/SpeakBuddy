import "./userDashboard.css";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import { useRef } from "react";

export default function Userdashboard({
  data,
  setIsLoggedIn,
  setClickUserAcc,
  setIsLogged,
}) {
  //data[3] = "https://cdn.pixabay.com/photo/2024/02/08/12/54/ai-generated-8561072_1280.png"
  const userIMG = data[3] || "./defaultDP.webp"; // default img or user uploaded img

  const imageRef = useRef(null);

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/logout", {
        withCredentials: true,
      });
      setIsLoggedIn(false); // the func will trigger & component rerender
      toast.success(res.data.msg);
      window.location.reload(); //reload the page
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="user-dashboard">
<input type="file" accept="image/*" ref={imageRef} style={{display:"none"}}  name="" id="" />

      <CloseIcon
        className="user-dashboard-close"
        onClick={() => {
          setClickUserAcc(false);
        }}
      />
      <Tooltip title="Edit image" placement="top">
        <div className="user-img" onClick={()=>{imageRef.current.click()}}>
          <img src={userIMG} alt="" className="user-img" />
          <AddAPhotoIcon />
        </div>
      </Tooltip>

      <h4 className="user-name">{data[0]}</h4>

      <RecordVoiceOverIcon />
      <h4 className="user-language">
        {data[1].map((ele) => {
          return (
            <div className="lang" key={ele}>
              {ele}
            </div>
          );
        })}
      </h4>

      <Button
        color="error"
        variant="outlined"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}
