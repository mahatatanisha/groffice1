import React, { useEffect, useState } from 'react'
import '../cssfiles/sidebarchat.css'
import { Avatar } from "@material-ui/core";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-male-sprites';
import { Link, useNavigate } from "react-router-dom";
import {db} from "./firebase";
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
  } from "firebase/firestore";

function SidebarChat() {
    const [seed, setSeed] = useState("");
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);
    let svg = createAvatar(style, {
        seed: 'custom-seed',
        // ... and other options
    });


    return (
        // <Link to={`/Users/MainRooms/${id}`} key={id}>
        <div className="sidebarchat">

            <div className="sidebarchat__header">
                <AccountCircleIcon src={`https://avatars.dicebear.com/api/human.${svg}`} />
                <h6>TYCS</h6>
            </div>

            <p>
            ciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae 
            </p>

        </div>
        // </Link>
    )
    // : (
    //     <div  className="sidebarChat">
    //         <h3 className="add-new-chat-title">Add New Chat</h3>
    //     </div>
    // )
}

export default SidebarChat