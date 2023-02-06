import React, { useState } from 'react'
import '../cssfiles/participants.css'
import { useUserAuth } from "../context/UserAuthContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';

import {db} from "./firebase";
import {
    collection,
    addDoc,
  } from "firebase/firestore";


  
export const Participants = ({ showModal, setShowModal }) => {
    const [checked, setChecked] = useState([]);
    const [input, setInput] = useState("");
    const { userid } = useUserAuth();
   
    const mainRoomDemoCOllectionRef = collection(db,`/Users/${userid}/MainRooms`);

    const checkList = ["Shivani", "Rishi","Mili", "Umang", "Kailsah"];
    const handleCheck = (event) => {
        var updatedList = [...checked];
        if (event.target.checked) {
            updatedList = [...checked, event.target.value];
            console.log(updatedList);
        } else {
            updatedList.splice(checked.indexOf(event.target.value), 1);
        }
        setChecked(updatedList);
    };


    var isChecked = (item) =>
        checked.includes(item) ? "checked-item" : "not-checked-item";

    const addMainGroup = (e) => {
        e.preventDefault();
        const grp = {
            Name: input,
            partipants: checked
        }
      
        addDoc(mainRoomDemoCOllectionRef, grp);

        setInput("");
        setShowModal(prev => !prev);
    }
    return (
        <>
            {showModal ? (
                <div className='Background'>
                    <div className="ModalWrapper">
                        <div className="CloseModalButton">
                            <button onClick={() => setShowModal(prev => !prev)}><CloseIcon /></button>
                        </div>
                        <div className="input">

                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="form-control form-input" placeholder="New Group Name..." />

                        </div>
                        <div className="done">
                        <h4>Add Participants:</h4>
                       <button className="Button" onClick={addMainGroup}>Done</button>
                        </div>
                        
                        <div className="checklist">
                            {checkList.map((item, index) => (
                                <div className="check-item" key={index}>
                                    <input value={item} type="checkbox" onChange={handleCheck} />
                                    <div className="account-name">
                                        <AccountCircleIcon fontSize='large' />
                                        <span className={isChecked(item)}>{item}</span>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            ) : null}

        </>
    );
};