import React from 'react'
import '../cssfiles/subgroupchattab.css'
import { useUserAuth } from "../context/UserAuthContext";


function SubgroupChatTab({id, name}) {
    const { setSubRoomId,setSubRoomName, userMainRoomDocId} = useUserAuth();



    const onSubGroupCLick = ()=>{
       console.log(window.location.href);
       const geturl = window.location.href;
       const url = geturl.toString()
       window.history.replaceState(null, null, `chat/${userMainRoomDocId}/SubRoom/${id}`);
       
        setSubRoomId(id);
        setSubRoomName(name);
      }


    return (
        <div className="subgroup" onClick={onSubGroupCLick}>
            <div className="profile__avatar" >
                <img src="https://techcrunch.com/wp-content/uploads/2011/11/android_logo.gif?w=730&crop=1" alt="" width="20px" height="20px" />
            </div>
            <h3 className='chat-room-name'>{name}</h3>
        </div>
    )
}

export default SubgroupChatTab