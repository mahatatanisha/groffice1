import React, { useEffect, useState, useContext } from 'react';
import '../cssfiles/chat.css'
import SubgroupChatTab from './SubgroupChatTab';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import { useUserAuth } from "../context/UserAuthContext";
import { db } from "./firebase";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Modal from '@mui/material/Modal';

import {

  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  addDoc,
  doc,
  serverTimestamp,

} from "firebase/firestore";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { user, userid, mainRoomId, mainRoomName, mainRoomParticipants } = useUserAuth();
  const [participantsNames, setParticipantsNames] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const url = `/MainRooms/${mainRoomId}/Messages`;
  const mainRoomPartiRef = doc(db, "MainRooms", mainRoomId);

  useEffect(() => {


    getParticipants();

  }, []);

  useEffect(() => {

    getMsgs();

  }, []);
  // }, [messages, mainRoomId]);

  const MyOptions = [
    "+ Create a Sub Group"
  ];
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const open = Boolean(anchorEl);
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const MessageollectionRef = collection(db, url);
  const q = query(MessageollectionRef, orderBy('timestamp', 'asc'));
  const getAllMsg = () => {
    return getDocs(q);
  }

  const getMsgs = async () => {
    const msgdata = await getAllMsg();
    setMessages(msgdata.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      message: doc.data().msg,
      timestamp: doc.data().timestamp
    })))
  }

  const sendMessage = (e) => {
    e.preventDefault();
    const message = {
      msg: input,
      name: user,
      timestamp: serverTimestamp(),
    }
    addDoc(MessageollectionRef, message);

    setInput("");
  }




  const getParticipants = async () => {
    const data = await getDoc(mainRoomPartiRef);

    const participant = data.data()["participants"];
    participant.forEach(async (user) => {
      const participantDoc = await getDoc(user);
      if (participantDoc.exists()) {
        console.log("details: ", participantDoc.data().name);
        setParticipantsNames((oldArray) => [...oldArray, participantDoc.data().name]);

      } else {
        // doc.data() will be undefined in this case
        console.log("No such user document!");
      }
    })

  }

  return (
    <div className='chat'>
      <div className="chat_box">
        <div className="chat__header">
          <div className="profile__avatar" >
            <img src="https://as2.ftcdn.net/v2/jpg/01/77/38/91/1000_F_177389160_wNADdOYpPWAP64NXYKNjVBn52A0UC3dy.jpg" alt="" width="50px" height="50px" />
          </div>
          <div className='chat_headerInfo'>
            <h3 className='chat-room-name'>{mainRoomName}</h3>
            <p className='chat-room-last-seen'>
              {participantsNames.map((participant) => (
                <span key={participant}>{participant},</span>
              ))}
            </p>

          </div>
          <IconButton
            aria-label="more"
            onClick={handleClick}
            aria-haspopup="true"
            aria-controls="long-menu"
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            MenuProps={{ keepMounted: false, disablePortal: true }}
            onClose={handleClose}
            open={open}>
            {MyOptions.map((option) => (
              <MenuItem
                key={option}
                onClick={handleClose}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
        <div className="sub-group">
          <SubgroupChatTab />
          <SubgroupChatTab />
          <SubgroupChatTab />
          <SubgroupChatTab />
        </div>
        <div className="chat__main">
          {messages.map(message => (

            <p key={message.timestamp} className={`${message.name === user ? "chat_receiver" : "chat_message"}`}>
              <span className="chat_name">{message.name}</span>
              {message.message}
              <span className="chat_timestemp">uhbk</span>
            </p>))}

        </div>

        <div className="chat__footer">
          <EmojiEmotionsOutlinedIcon />
          <form>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" />
            <button type="submit" onClick={sendMessage}> Send a Message</button>
          </form>
          <MicNoneOutlinedIcon />
        </div>
      </div>

    </div>

  )
}

export default Chat
