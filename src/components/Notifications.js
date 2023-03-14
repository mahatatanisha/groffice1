import React, { useState } from 'react'
import '../cssfiles/notifications.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useUserAuth } from "../context/UserAuthContext";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Spinner from './Spinner';

function Notifications({ id, value, notifierName, notifierid, response }) {

  const { userid, user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [accept, setAccept] = useState(false);
  const [decline, setDecline] = useState(false);

  const notificationsDocRef = doc(db, `/Users/${userid}/Notifications/${id}`);
  const notifierNotificationRef = collection(db, `/Users/${notifierid}/Notifications`);


  const participantsRef = collection(db, `/Users/${userid}/Participants`);
  const notifierParticipantRef = collection(db, `/Users/${notifierid}/Participants`);

  const addParticipant = async () => {
    try {
      setLoading(true);
      const userParticipant = {
        participantId: notifierid,
        participantName: notifierName,

      }
      const notifierParticipant = {
        participantId: userid,
        participantName: user,
      }
      const notifierNoti = {
        Notifier: `${userid}`,
        Value: `${user} accepted your Request!`,
        NotifierName: `${user}`,
        Response: true,
       
      }


      await updateDoc(notificationsDocRef, {
        Response: true
      });
      await addDoc(notifierNotificationRef,notifierNoti)
      await addDoc(participantsRef, userParticipant)
      await addDoc(notifierParticipantRef, notifierParticipant)
      setLoading(false);

      await addDoc()

    } catch (error) {
      console.log(error);
    }
  }



  const declineRequest = async () => {
    setLoading(true);
    await deleteDoc(notificationsDocRef);
    setLoading(false);
  }
  return (
    <>
      {decline ? "" : <div className="notification-item">
        <p><AccountCircleIcon />  {value} </p>

        {loading && accept ? <Spinner /> : ""}
        {(accept || response )? "" :
          <div className="grp-btn">
            <button className='btn' onClick={() => { declineRequest(); setDecline(true) }}>Decline</button>
            <button className='btn' onClick={() => { addParticipant(); setAccept(true) }}>Accept</button>
          </div>
        }



      </div>}
    </>


  )
}

export default Notifications