import * as React from "react";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useState, useEffect } from "react";
import axios from "axios";
import "./chatPage.css";
import Chat from "./Chat.jsx";
import RefreshIcon from "@mui/icons-material/Refresh";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ChatPage({ setIsOpenChatPage, userId }) {
  const [allUsersList, setAllUsersList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState("");

  useEffect(() => {
    const del = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/c/users-chat?userId=${userId}`,
        { withCredentials: true },
      );
      console.log(res.data);
      setAllUsersList(res.data);
    };

    del();
  }, [userId, isOpen]);

  const Refresh = () => {
    const del = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/c/users-chat?userId=${userId}`,
        { withCredentials: true },
      );
      console.log(res.data);
      setAllUsersList(res.data);
    };

    del();
  };

  const handleOpenChat = (id) => {
    //  console.log(id);
    setRemoteUserId(id);
    setIsOpen(true);
  };

  return (
    <>
      <React.Fragment>
        <Dialog
          open={open}
          slots={{
            transition: Transition,
          }}
          PaperProps={{
            sx: {
              background: "linear-gradient(#0B141A,#111B21)",
              color: "#fff",
              width: "94vw",
              margin: 0,

              overflowX: "hidden",
              border: "1px solid #ffffff21",
            },
          }}
          slotProps={{
            backdrop: {
              sx: {
                backdropFilter: "blur(4px)",
              },
            },
          }}
        >
          <AppBar
            sx={{ position: "sticky", top: "0px" }}
            style={{ background: "linear-gradient(#0B141A,#111B21)" }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setIsOpenChatPage(false)}
                aria-label="close"
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div style={{ fontWeight: "600" }}>Chats</div>
                <div onClick={Refresh} style={{ cursor: "pointer" }}>
                  <Tooltip title="Refresh" placement="top">
                    <RefreshIcon />
                  </Tooltip>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          <List style={{ padding: "5px", marginTop: "10px" }}>
            <ListItemButton
              style={{
                backgroundColor: "#1b262e",
                borderRadius: "15px",
                margin: "10px 0",
              }}
                  onClick={() => {
                  alert(
                    "Currently unavailable, please try again later.\n\nThank you.",
                  );
                }}
            >
              <AutoAwesomeIcon
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(182, 0, 232, 0.89), rgba(0, 232, 228, 0.89))",
                  borderRadius: "50%",
                  height: "30px",
                  width: "30px",
                }}
                
              />
              &nbsp; &nbsp;&nbsp;&nbsp;
              <div
                style={{ color: "rgb(28, 234, 172)" }}
                className="remote-name"
              >
                Jini Ai
              </div>
            </ListItemButton>
            {isOpen ? (
              <Chat
                setChatOpen={setIsOpen}
                getRemoteUserId={remoteUserId}
                userId={userId}
              />
            ) : null}

            {allUsersList.map((ele) => {
              return (
                <ListItemButton
                  style={{
                    backgroundColor: "#1b262e",
                    borderRadius: "15px",
                    margin: "10px 0 10px 0",
                  }}
                  key={ele._id}
                  onClick={() => {
                    handleOpenChat(ele.user._id);
                  }}
                >
                  <div className="remote">
                    <img
                      src={ele.user.image}
                      alt=""
                      className="remote-profile"
                    />
                    &nbsp;&nbsp;&nbsp;
                    <Badge
                      badgeContent={
                        !ele.isRead && userId !== ele.senderId ? 1 : 0
                      }
                      color="error"
                    >
                      <div className="remote-body">
                        <div className="remote-name">{ele.user.username}</div>
                        <div className="remote-last-msg">{ele.lastMessage}</div>
                      </div>
                    </Badge>
                  </div>
                </ListItemButton>
              );
            })}
          </List>
        </Dialog>
      </React.Fragment>
    </>
  );
}
