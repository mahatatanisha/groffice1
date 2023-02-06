import React, {useEffect} from 'react'
import Chat from './Chat'
import Profile from './Profile'
import Sidebar from './Sidebar'
import { useParams } from 'react-router-dom';
import '../cssfiles/mainchat.css'
import { useUserAuth } from "../context/UserAuthContext";

function MainChat() {
  
  const { mainRoomId } = useUserAuth();
  // useEffect(()=>{
   
  // },[]);
  return (
    <div className='app_body'>
        <Profile/>
        <Sidebar/>
        {mainRoomId?(<Chat/>):
        (
          <div className="not-chat">
            <h1>GrOffice...</h1>
          </div>
        )}
        {/* <Chat/> */}
        
    </div>
  )
}

export default MainChat