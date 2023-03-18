import React, { useEffect, useState } from 'react';
import '../cssfiles/Sidebar.css'
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import SidebarChat from './SidebarChat';
import { useUserAuth } from "../context/UserAuthContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Spinner from './Spinner';
import { db } from "./firebase";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {

  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { Participants } from './Participants';


function Sidebar() {
  const [rooms, setRooms] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [callFrom, setCallFrom] = useState("MainGroup");
  const [docid, setDocID] = useState("");
  const { userid, mainRoomId, callFrom, setCallFrom } = useUserAuth();
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);


  const mainRoomDemoRef = collection(db, `/Users/${userid}/MainRooms`);
  const mainRoomRef = collection(db, "/MainRooms");
  const usersCollectionRef = collection(db, "Users");
  const participantsRef = collection(db, `/Users/${userid}/Participants`);


  useEffect(() => {

    getRoomRef();


  }, []);

  const openModal = () => {

    setShowModal(prev => !prev);

  };



  const getParticipantsSidebar = () => {
    return getDocs(participantsRef);
  }

  const getPartiSidebar = async () => {
    setLoading(true);

    const partidata = await getParticipantsSidebar();
    setParticipants(partidata.docs.map((doc) => ({
      id: doc.id,
      participantId: doc.data().participantId,
      participantName: doc.data().participantName,

    })))
    setLoading(false);
  }

  const getAllRooms = () => {
    return getDocs(mainRoomDemoRef);
  };

  const getRoomRef = async () => {
    setLoading(true);
    const data = await getAllRooms();
    data.docs.forEach(async (document) => {
      setDocID(document.id);
      console.log("SideBAr: ", document.id);
      const roomRef = document.data()["GrpRef"];
      const roomDoc = await getDoc(doc(mainRoomRef, roomRef));
      setRooms((oldArray) => [...oldArray, {
        id: roomDoc.id,
        Name: roomDoc.data().Name,
        userMainRoom: document.id,
      }]);

      setLoading(false);




    })


  };





  return (
    <div className='sidebar'>

      <div className="sidebar__header">
        <div className="sidebar__header__top">
          <h3>Chats</h3>
        </div>
        <button className='parti-icon' onClick={() => {

          if (!showParticipants) {
            setShowParticipants(true);
            getPartiSidebar();
          } else {
            setShowParticipants(false);
          }
        }}><PeopleAltIcon /></button>
        <a className="btn btn-1" onClick={() => { setCallFrom("MainGroup"); openModal(); }}>
          <AddIcon /> New group</a>
        {callFrom ? <Participants showModal={showModal} setShowModal={setShowModal} /> : ""}

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
      {showParticipants ? <div className='sidebar__chats'>
        <h3>Participants List</h3>
       
        {participants.map((item) => (
          <div className="sidebarchat">

            <div className="sidebar__header">
              <AccountCircleIcon fontSize='large' />
              <h6>{item.participantName}</h6>
            </div>

          </div>))}

      </div> : <div className="sidebar__chats">{loading ? <Spinner /> :
        rooms.map(room => (
          <SidebarChat key={room.id} id={room.id} name={room.Name} MainRoom={room.userMainRoom} />
        ))
      }</div>}







    </div>
  )
}

export default Sidebar