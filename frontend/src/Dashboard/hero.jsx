import { useEffect, useState } from "react";
import "./hero.css";
import Button from "@mui/material/Button";
import axios from "axios";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Badge from "@mui/material/Badge";
import CircularProgress from '@mui/material/CircularProgress';


export default function Hero() {
  const [usersData, setUsersData] = useState([]);
  const [loading , setLoading] = useState(true);

  const languages = [
    { id: 0, name: "All" },
    { id: 1, name: "English" },
    { id: 2, name: "Bengali" },
    { id: 3, name: "Hindi" },
    { id: 4, name: "Tamil" },
    { id: 5, name: "Spanish" },
    { id: 6, name: "Russion" },
    { id: 7, name: "Punjabi" },
    { id: 8, name: "French" },
    { id: 9, name: "German" },
    { id: 10, name: "Japanese" },
    { id: 11, name: "Marathi" },
    { id: 12, name: "Odia" },
    { id: 13, name: "Nepali" },
    { id: 14, name: "Urdu" },
  ];

  const getUsers = async (language) => {
    const res = await axios.get(
      `http://localhost:8080/api/users/find?lang=${language}`,
      { withCredentials: true },
    );
    setUsersData(res.data.users);
   
  };
  const findLanguage = (lang) => {
    console.log(lang);
    getUsers(lang);


  };

  useEffect(()=>{
    axios.get(
      `http://localhost:8080/api/users/find?lang=All`,
      { withCredentials: true },
    ).then((res)=>{
        setUsersData(res.data.users);
         setLoading(false);
    })
  },[])
//   console.log(usersData);
  


  const imgURL = "./defaultDP.webp";

  return (
    <>
      <div className="main">
        <h2 className="hero">Language Exchange Network</h2>
      </div>

      <div className="language-filter">
        {languages.map((language) => {
          return (
            <Button
              variant="outlined"
              size="small"
              key={language.id}
              sx={{ textTransform: "none" }}
              onClick={() => {
                findLanguage(language.name);
              }}
            >
              {language.name}
            </Button>
          );
        })}
      </div>


        {loading? <div className="loading">
      <CircularProgress />
    </div> : 
      <div className="users-container">
        {usersData.length == 0 ? (
          // <h4 style={{ margin: "auto" }}>Sorry, No Data Found!</h4>
          <img src="./GIF/pudgy-penguin.gif" alt="" srcset="" style={{ margin: "auto" , width:"250px" ,opacity:"0.9"}}/>
        ) : (
          usersData.map((ele) => {
            return (
              <div className="user-card" key={ele.email}>
                
                <div className="user-nav-bar">
                  <Badge color="error" variant="dot">
                    <img src={imgURL} alt="" />
                  </Badge>
                  <div className="user-nav">
                    <span style={{ fontWeight: "700", color: "#a0a0a0" }}>
                      {ele.username}
                    </span>
                    <span style={{ color: "#b2b2b2" }}>
                      {ele.language.join(" + ")}
                    </span>
                  </div>
                </div>
                <div className="main-img">
                  <img src={imgURL} alt="" />
                </div>
                <div className="main-img">
                 <Button variant="outlined" color="error">
                    <VideoCallIcon /> Connect.
                  </Button>
                  <Button variant="outlined" color="success">
                    <CallIcon /> Connect.
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>}
    </>
  );
}
