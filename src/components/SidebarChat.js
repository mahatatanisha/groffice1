import React, { useEffect, useState } from 'react'
import '../cssfiles/sidebarchat.css'
import { Avatar } from "@material-ui/core";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-male-sprites';
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

import {db} from "./firebase";
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
  } from "firebase/firestore";

function SidebarChat({id,name,MainRoom}) {
    const [grpMsg, setGrpMsg] = useState("");
    const { setSubRoomName,setSubRoomId, setMainRoomId,  setMainRoomName,  setUserMainRoomDocId } = useUserAuth();

    const MessageollectionRef = collection(db,`/MainRooms/${id}/Messages`);
    const q = query(MessageollectionRef, orderBy('timestamp', 'desc'),limit(3));

    useEffect(() => {
        showMessage();
    }, []);
    
    const getAllMsg = () => {
        return getDocs(q);
      }
    const showMessage = async()=>{
        const msgdata = await getAllMsg();
        setGrpMsg(msgdata.docs.map((doc) => ({
          name: doc.data().name,
          message: doc.data().msg,
        })))
      }
       
      const onSidebarChatCLick = ()=>{
        setMainRoomId(id);
        setMainRoomName(name);
        setSubRoomId(null);
        setSubRoomName(null);
        setUserMainRoomDocId(MainRoom);
        console.log("OnSideBarClick:",MainRoom)
        window.history.replaceState(null, null, `/chat/${id}`);
       
      }
    

    return (
         
        <div className="sidebarchat" onClick={onSidebarChatCLick}>

            <div className="sidebarchat__header">
                <AccountCircleIcon />
                <h6>{name}</h6>
               
            </div>
          
            <p>
            
            </p>

        </div>
        
    )
    // : (
    //     <div  className="sidebarChat">
    //         <h3 className="add-new-chat-title">Add New Chat</h3>
    //     </div>
    // )
}

export default SidebarChat