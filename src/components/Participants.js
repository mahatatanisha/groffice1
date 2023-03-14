import React, { useEffect, useState, useRef } from 'react'
import '../cssfiles/participants.css'
import { useUserAuth } from "../context/UserAuthContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';

import { db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    DocumentReference,
} from "firebase/firestore";



export const Participants = ({ showModal, setShowModal }) => {

    const dataFetchedRef = useRef(false);
    useEffect(() => {
        if (dataFetchedRef.current) return;
        if (callFrom === "MainGroup") {
            getParti();
        } else {
            if (mainRoomId) {
                getSubRoomParti();
                console.log("Doc ID:: ",userMainRoomDocId)
                dataFetchedRef.current = true;
            }


        }


    }, [callFrom]);

    const [checked, setChecked] = useState([]);
    const [input, setInput] = useState("");
    const { userid, user,callFrom, mainRoomId,userMainRoomDocId } = useUserAuth();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [subparticipants, setSubParticipants] = useState([]);

    const mainRoomDemoCOllectionRef = collection(db, `/Users/${userid}/MainRooms`);
    const mainRoomRef = collection(db, "/MainRooms");
    const participantsRef = collection(db, `/Users/${userid}/Participants`);





    const handleCheck = (event) => {
        var updatedList = [...checked];
        if (event.target.checked) {
            updatedList = [...checked, event.target.value];

        } else {
            updatedList.splice(checked.indexOf(event.target.value), 1);
        }
        
        setChecked(updatedList);
    };




    const getSubRoomParti = async () => {
        setLoading(true);
        console.log("mainroomid ", mainRoomId)
        const data = await getDoc(doc(mainRoomRef, mainRoomId));
        const participant = data.data().participants;
        participant.forEach(async (user) => {
            const participantDoc = await getDoc(doc(db, `/Users/${user}`));
            if (participantDoc.exists()) {
                console.log("details: ", participantDoc.data().name);
                setSubParticipants((old) => [...old, {
                    id: participantDoc.data().email,
                    participantName: participantDoc.data().name,
                    participantId: user,
                }]);

            } else {
                // doc.data() will be undefined in this case
                console.log("No such user document!");
            }
        })
        setLoading(false);
    }
    const getAllParti = () => {
        return getDocs(participantsRef);
    }

    const getParti = async () => {
        setLoading(true);
        console.log("inside getParti")
        const partidata = await getAllParti();
        setParticipants(partidata.docs.map((doc) => ({
            id: doc.id,
            participantId: doc.data().participantId,
            participantName: doc.data().participantName,

        })))
        setLoading(false);
    }

    var isChecked = (item) =>
        checked.includes(item.participantId) ? "checked-item" : "not-checked-item";

    const addSubGroup = async (e) => {
        e.preventDefault();
        const grp = {
            Name: input,
            participants: checked,
            admin: user,
            adminId: userid,
        }
        const subRoomRef = collection(db, `/MainRooms/${mainRoomId}/SubRooms`);

        await addDoc(subRoomRef, grp).then(async Document => {

            const path = Document.id;
            const room = {
                GrpRef: `/${path}`,
            }
            
            checked.forEach(async id => {
                const participantSubRoomRef = collection(db, `/Users/${id}/MainRooms/${userMainRoomDocId}/SubRooms`)
                await addDoc(participantSubRoomRef, room);
            })
        }

        )


        setInput("");
        setShowModal(prev => !prev);
    }

    const addMainGroup = async (e) => {
        e.preventDefault();
        setChecked(oldArray => [...oldArray,userid]);
        const grp = {
            Name: input,
            participants: checked,
            admin: user,
            adminId: userid,
        }

        await addDoc(mainRoomRef, grp).then(async Document => {

            const path = Document.id;
            const room = {
                GrpRef: `/${path}`,
            }
            await addDoc(mainRoomDemoCOllectionRef, room);
            checked.forEach(async id => {
                const participantMainRoomRef = collection(db, `/Users/${id}/MainRooms`)
                await addDoc(participantMainRoomRef, room);
            })
        }

        )

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
                        {callFrom === "MainGroup" ?
                            <button className="Button" onClick={addMainGroup}>Add Main Group</button> :
                            <button className="Button" onClick={addSubGroup}>Add Sub Group</button>}
                        <div className="done">
                            <h4>Add Participants:</h4>

                        </div>
                        {callFrom === "MainGroup" ? <div className="checklist">
                            {participants.map((item) => (
                                <div className="check-item" key={item.id}>
                                    <input value={item.participantId} type="checkbox" onChange={handleCheck} />
                                    <div className="account-name">
                                        <AccountCircleIcon fontSize='large' />
                                        <span className={isChecked(item)}>{item.participantName}</span>
                                    </div>

                                </div>
                            ))}
                        </div> : <div className="checklist">
                            {subparticipants.map((item) => (
                                <div className="check-item" key={item.id}>
                                    <input value={item.participantId} type="checkbox" onChange={handleCheck} />
                                    <div className="account-name">
                                        <AccountCircleIcon fontSize='large' />
                                        <span className={isChecked(item)}>{item.participantName}</span>
                                    </div>

                                </div>
                            ))}
                        </div>}





                    </div>
                </div>

            ) : null}

        </>
    );
};