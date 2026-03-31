import "./userDashboard.css";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import { useRef, useState } from "react";

export default function Userdashboard({
  data,
  setData,
  setIsLoggedIn,
  setClickUserAcc,
  setIsLogged,
}) {
  const imageRef = useRef(null);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/logout`, {
        withCredentials: true,
      });
      setIsLoggedIn(false); // the func will trigger & component rerender
      toast.success(res.data.msg);
      window.location.reload(); //reload the page
    } catch (e) {
      console.log(e);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("image", file);

  
      axios.patch(
        `${import.meta.env.VITE_API_URL}/api/uploads/update-image/${data[3]}`,
        formData,
      { withCredentials: "true"}
      ).then((res)=>{
     
      setData((prev)=>{
        const copy = [...prev];
        copy[2] = res.data.data.image;
        return copy;
      })
       console.log(res.data.data.image);
      });
   
  };
 
  const userIMG = data[2]; 
  console.log("data  ",data);

  return (
    <div className="user-dashboard">
      <form action="" onChange={handleImageUpload}>
        <input
          type="file"
          accept="image/*"
          ref={imageRef}
          style={{ display: "none" }}
          name=""
          id=""
        />
      </form>

      <CloseIcon
        className="user-dashboard-close"
        onClick={() => {
          setClickUserAcc(false);
        }}
      />
      <Tooltip title="Edit image" placement="top">
        <div
          className="user-img"
          onClick={() => {
            imageRef.current.click();
          }}
        >
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
