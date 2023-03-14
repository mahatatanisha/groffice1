import React, { useEffect, useState, useRef } from 'react';
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
import { Participants } from './Participants';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import upload from 'D:/ReactApp/groffice/src/upload.png'

import {
  ref,
  getStorage,
  uploadBytes,
  deleteObject,
  getMetadata,
  listAll,
  getDownloadURL,

} from "firebase/storage";

import { Link } from "react-router-dom";
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
import ChartSlider from './ChartSlider';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { user, userid, mainRoomId, mainRoomName, userMainRoomDocId, subRoomId, subRoomName, callFrom, setCallFrom } = useUserAuth();
  const [participantsNames, setParticipantsNames] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // const [callFrom, setCallFrom] = useState(null);
  const [subRooms, setSubRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setAnalysis] = useState(false);

  const url1 = `/MainRooms/${mainRoomId}/Messages`;

  const mainRoomRef = collection(db, "/MainRooms");
  const clickedMainRoomSubRoomsRef = collection(db, `/Users/${userid}/MainRooms/${userMainRoomDocId}/SubRooms`)
  const subRoomRef = collection(db, `/MainRooms/${mainRoomId}/SubRooms`)



  const latestValue = useRef(mainRoomId)
  let prev = mainRoomId;
  const dataFetchedRef = useRef(false);



  useEffect(() => {
    if (dataFetchedRef.current) return;
    if (prev !== latestValue.current) {
      prev = latestValue.current
      //getMsgs();
      getSubRoomRef();


    }
    getSubRoomRef();


    dataFetchedRef.current = true;
  }, [mainRoomId, messages, participantsNames]);

  useEffect(() => {
    const geturl = window.location.href;
    const url = geturl.toString().split('/');
    let breakCondition = false;
    let flag = false;
    while (!breakCondition) {
      url.forEach((item) => {
        if (item === 'SubRoom') {
          if (subRoomId) {
            getSubMsgs();
            breakCondition = true;
            flag = true;
          }
        }
      })

      if (!flag) { getMsgs(); }
      breakCondition = true;
    }



  }, [messages])
  //more options of chat (eg.creating sub groups)

  const MyOptions = [
    "+ Create a Sub Group"
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

    console.log("you clicked!")
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setShowModal(prev => !prev);
    setCallFrom("SubGroup");
    setAnchorEl(null);
  };

  //retrieving all subrooms of the clicked mainroom
  const getAllSubRooms = () => {
    return getDocs(clickedMainRoomSubRoomsRef);
  };

  const getSubRoomRef = async () => {
    setLoading(true);
    const data = await getAllSubRooms();
    data.docs.forEach(async (document) => {
      console.log("in getAllSubRoom")
      const roomRef = document.data()["GrpRef"];
      const roomDoc = await getDoc(doc(subRoomRef, roomRef));
      console.log("Sub Rooms", (oldArray) => [...oldArray, {
        id: roomDoc.id,
        Name: roomDoc.data().Name,

      }])
      setSubRooms((oldArray) => [...oldArray, {
        id: roomDoc.id,
        Name: roomDoc.data().Name,

      }]);

      setLoading(false);

    })
  }

  //retrieving messages of main room
  const MessageollectionRef = collection(db, url1);
  const q1 = query(MessageollectionRef, orderBy('timestamp', 'asc'));
  const getAllMsg = () => {
    return getDocs(q1);
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

  //retrieving messages of Sub room
  const subRoomMessageollectionRef = collection(db, `/MainRooms/${mainRoomId}/SubRooms/${subRoomId}/Messages`);
  const q2 = query(subRoomMessageollectionRef, orderBy('timestamp', 'asc'));
  const getSubAllMsg = () => {
    return getDocs(q2);
  }

  const getSubMsgs = async () => {
    const msgdata = await getSubAllMsg();
    setMessages(msgdata.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      message: doc.data().msg,
      timestamp: doc.data().timestamp
    })))
  }
  //sending message onclick of enter btn.
  const sendMessage = (e) => {
    e.preventDefault();
    const message = {
      msg: input,
      name: user,
      timestamp: serverTimestamp(),
    }
    const geturl = window.location.href;
    const url = geturl.toString().split('/');
    let breakCondition = false;
    let flag = false;
    while (!breakCondition) {
      url.forEach((item) => {
        if (item === 'SubRoom') {
          addDoc(subRoomMessageollectionRef, message);
          breakCondition = true;
          flag = true;
        }
      })

      if (!flag) { addDoc(MessageollectionRef, message); }
      breakCondition = true;
    }

    setInput("");
  }


  //Retrieving all the participants of mainRoom selected.

  const getParticipants = async () => {
    const data = await getDoc(doc(mainRoomRef, mainRoomId));

    const participant = data.data().participants;
    participant.forEach(async (user) => {
      const participantDoc = await getDoc(doc(db, `Users/${user}`));
      if (participantDoc.exists()) {
        console.log("details: ", participantDoc.data().name);
        setParticipantsNames((oldArray) => [...oldArray, participantDoc.data().name]);

      } else {
        // doc.data() will be undefined in this case
        console.log("No such user document!");
      }
    })

  }
  const storage = getStorage();

  const listRef = ref(storage, `${userid}/groupPic/${mainRoomId}`);

  const listAllDocuments = () => {
    listAll(listRef)
      .then((res) => {

        res.items.forEach((itemRef) => {

          getMetadata(ref(storage, `${userid}/groupPic/${mainRoomId}/${itemRef.name}`))
            .then((metadatas) => {
              console.log("profile pic", metadatas.fullPath);
              getDownloadURL(ref(storage, metadatas.fullPath))
                .then((url) => {
                  const img = document.getElementById('document');
                  img.setAttribute('src', url);
                })

            })
            .catch((error) => {
              // Uh-oh, an error occurred!
            });

        });



      }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log("Uh-oh, an error occurred!");
      });
  }

  const uploadFile = async (e) => {
    const fileName = e.target.files[0];
    const metadata = {
      customMetadata: {
        name: user,
        userId: userid,

      },
    };
    listAll(listRef).then((res) => {
      res.items.forEach(async (itemRef) => {
        const desertRef = ref(storage, `${userid}/groupPic/${mainRoomId}/${itemRef.name}`);
        await deleteObject(desertRef).then(() => {
          console.log("pics deleted")
        })
      })

    }).then(async () => {
      if (fileName == null) return;
      const imageRef = ref(storage, `${userid}/profilePic/${fileName.name}`);
      await uploadBytes(imageRef, fileName, metadata).then(() => {
        alert("Profile picture updated");

      });
    })







  };

  return (
    <div className='chat'>
      <div className="chat_box">
        <div className="chat__header">
          <div className="profile__avatar chat-avatar" >
            <div className='img2 image'> <img src="https://as2.ftcdn.net/v2/jpg/01/77/38/91/1000_F_177389160_wNADdOYpPWAP64NXYKNjVBn52A0UC3dy.jpg" alt="" width="55px" height="55px" /></div>
            <div className='img2 image'><img id='document' alt="" width="55px" height="55px" /></div>
            <div className='camera chatcamera image '><PhotoCameraIcon className='cameraog' /></div>
            <div className="camera chatcamera image"><input type="file" onChange={(event) => {
              uploadFile(event);


            }} /></div>
          </div>
          <div className='chat_headerInfo'>
            <h3 className='chat-room-name'>{mainRoomName}</h3>
            {subRoomId ? <h4>{subRoomName}</h4> : ""}
            <p className='chat-room-last-seen'>
              {participantsNames.map((participant) => (
                <span key={participant}>{participant},</span>
              ))}
            </p>

          </div>
          <button onClick={() => { !showAnalysis ? setAnalysis(true) : setAnalysis(false) }}><AnalyticsIcon fontSize='large' /></button>
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
            menuprops={{ keepMounted: false, disablePortal: true }}
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
          {
            subRooms.map(room => (
              < SubgroupChatTab key={room.id} id={room.id} name={room.Name} />
            ))
          }
        </div>
        <div className="parti-list">
          {mainRoomId ? <Participants showModal={showModal} setShowModal={setShowModal} /> : ""}


        </div>
        {showAnalysis ? <ChartSlider /> : <>
          <div className="chat__main">

            {messages ? messages.map(message => (

              <p key={message.timestamp} className={`${message.name === user ? "chat_receiver" : "chat_message"}`}>
                <span className="chat_name">{message.name}</span>
                {message.message}
                <span className="chat_timestemp">uhbk</span>
              </p>)) : "Start the Conversation!"}

          </div>

          <div className="chat__footer">
            <EmojiEmotionsOutlinedIcon />
            <form>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" />
              <button type="submit" onClick={sendMessage}> Send a Message</button>
            </form>
            <MicNoneOutlinedIcon />
          </div>
        </>}


      </div>

    </div>

  )
}

export default Chat
