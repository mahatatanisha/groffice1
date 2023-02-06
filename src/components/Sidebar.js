import React, { useEffect, useState } from 'react';
import '../cssfiles/Sidebar.css'
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import SidebarChat from './SidebarChat';
import { useUserAuth } from "../context/UserAuthContext";

import { db } from "./firebase";
import {

  collection,
  getDocs,
  getDoc,

} from "firebase/firestore";
import { Participants } from './Participants';


function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [participantsNames, setParticipantsNames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { userid } = useUserAuth();

  const list = ["Shivani", "Rishi", "Mili", "Umang", "Kailsah"];

  const mainRoomDemoRef = collection(db, `/Users/${userid}/MainRooms`);

  useEffect(() => {

    getRoomRef();


  }, []);

  const openModal = () => {
    setShowModal(prev => !prev);
  };



  // const getAllParticipants=()=>{
  //   return getDocs(participantsCollectionRef);
  // }

  const getAllRooms = () => {
    return getDocs(mainRoomDemoRef);
  };

  const getRoomRef = async () => {
    const data = await getAllRooms();
    data.docs.forEach(async (doc) => {
      const roomRef = doc.data()["GrpRef"];
      const roomDoc = await getDoc(roomRef);
      if (roomDoc.exists()) {
        const participants = roomDoc.data().participants;
        participants.forEach(async (user) => {
          const participantDoc = await getDoc(user);
          if (participantDoc.exists()) {
            console.log("details: ", participantDoc.data().name);
            setParticipantsNames((oldArray) => [...oldArray, participantDoc.data().name]);

          } else {
            // doc.data() will be undefined in this case
            console.log("No such user document!");
          }
        })

        setRooms( (oldArray) => [...oldArray, { 
          id: roomDoc.id, 
          Name: roomDoc.data().Name, 
          members: participantsNames,
        }]);



      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }

    })


  };





  return (
    <div className='sidebar'>

      <div className="sidebar__header">
        <div className="sidebar__header__top">
          <h3>Chats</h3>
          <div className="recentchats">
            <h6>Recent chats</h6>
            <KeyboardArrowDownIcon />
          </div>
        </div>
        <a className="btn btn-1" onClick={openModal}>
          <AddIcon /> Create new group</a>
        <Participants showModal={showModal} setShowModal={setShowModal} />
      </div>



      <div className="sidebar__search">
        <div className="container">

          <div className="row height d-flex justify-content-center align-items-center">

            <div className="">

              <div className="form">
                <i className="fa fa-search"></i>
                <input type="text" className="form-control form-input" placeholder="Search Rooms..." />
                <span className="left-pan"><i className="fa fa-search"> <SearchIcon /></i></span>
              </div>

            </div>

          </div>

        </div>
      </div>


      <div className="sidebar__chats">
        {rooms.map(room => (
          <SidebarChat key={room.id} id={room.id} name={room.Name} participants={room.members} />
        ))}

      </div>
    </div>
  )
}

export default Sidebar