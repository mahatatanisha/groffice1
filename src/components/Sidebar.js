import React, { useEffect, useState } from 'react';
import '../cssfiles/Sidebar.css'
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import SidebarChat from './SidebarChat';
import { db } from "./firebase";
import {
  collection,
  getDocs,
  collectionGroup, 
  query,
   where,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";


function Sidebar() {
//   const [rooms, setRooms] = useState([]);

//   const id= "bg400J3DAYimXIvTUi07";
//   const userCollection = collection(db, "Users");

//   const museums = query(collectionGroup(db, 'MainRooms'));
//   const querySnapshot = await getDocs(museums);

//   useEffect(() => {
//     const unsubscribe = userCollection.doc(id).collection('MainRooms').onSnapshot(snapshot => (
//         setRooms(snapshot.docs.map(doc => (
//             {
//                 id: doc.id,
//                 data: doc.data()
//             }
//         )

//         ))
//     ));

    
//   querySnapshot.forEach((doc) => {
//       console.log(doc.id, ' => ', doc.data());
//   });
//     return () => {
//         unsubscribe();
//     }
// },[id]); 
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
        <a className="btn btn-1">
          <AddIcon /> Create new group</a>
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
        <SidebarChat/>
        <SidebarChat/>


        {/* <SidebarChat addNewChat />
        {rooms.map(room => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))} */}

      </div>
    </div>
  )
}

export default Sidebar