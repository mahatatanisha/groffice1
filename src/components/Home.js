import React, { useState } from 'react';
import '../cssfiles/home.css';
import Profile from './Profile'
import logo from '../logogroffice.png';
import AsyncSelect from 'react-select/async';
import Spinner from './Spinner';
import { db } from "./firebase";
import { useUserAuth } from "../context/UserAuthContext";
import {
  collection,
  getDocs,
  endAt,
  query, orderBy, startAt, addDoc
} from "firebase/firestore";

function Home() {

  const [selectedTag, setSelectedTag] = useState(false);
  const [btntxt, setbtntxt] = useState("Send Request");
  const [actorid, setActorId] = useState(null);
  const [actorname, setActorName] = useState(null);
  const [actoremail, setActorEmail] = useState(null);
  const { userid, user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);

  const usersCollectionRef = collection(db, "Users");


  const loadOptions = async (inputValue) => {
    inputValue = inputValue.replace(/\W/g, "");
    return new Promise(async (resolve) => {
      const q = query(usersCollectionRef, orderBy("name"), startAt(inputValue), endAt(inputValue + "\uf8ff"));
      const suggestiondata = await getDocs(q);


      if (!suggestiondata.docs.empty) {

        let recommendedTags = []
        suggestiondata.docs.forEach((doc) => {
          const tag = {
            value: doc.id,
            label: doc.data().name,
            email: doc.data().email
          }
          recommendedTags.push(tag)
        });
        return resolve(recommendedTags)
      } else {

        return resolve([])
      }
    })

  }



  const handleOnChange = async (tags) => {
    setActorId(tags.value);
    setActorName(tags.label);
    setActorEmail(tags.email);
    await getParti(tags.value);

  }

  const notificationsRef = collection(db, "/Notifications");
  const actornotificationRef = collection(db, `/Users/${actorid}/Notifications`);
  const participantsRef = collection(db, `/Users/${userid}/Participants`);

  const getAllParti = () => {

    return getDocs(participantsRef);
  }

  const getParti = async (id) => {
    setLoading(true);
    const partidata = await getAllParti();
    let breakCondition = false;
    let flag = false;
    while (!breakCondition) {
      partidata.docs.map((doc) => {
        if (id === doc.data().participantId) {
          setbtntxt("Already friends");
          breakCondition = true;
          flag = true;
        }
      })
      if (!flag) { setbtntxt("Send Request."); }
      breakCondition = true;
    }



    setLoading(false);
  }


  const sendRequest = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {


      const notification = {
        Notifier: `/Users/${userid}`,
        Actor: `/Users/${actorid}`,
        Value: `${user} sent you a request!`
      };

      const actornotification = {
        Notifier: `${userid}`,
        Value: `${user} sent you a request!`,
        NotifierName: `${user}`,
        Response: false
      }

      await addDoc(notificationsRef, notification);
      await addDoc(actornotificationRef, actornotification);

      // e.currentTarget.disabled = true;
      setLoading(false);
      setbtntxt("Sent!")


    } catch (error) {
      console.log("Error in sending request!", error);
    }

  }

  return (
    <div className='home'>
      <Profile />
      <div className="icon">
        <h1>Welcome Back!</h1>

        <div className='search-user'>
          <AsyncSelect className='AsyncSelect'

            placeholder="Search User"
            loadOptions={loadOptions}
            onChange={handleOnChange}
          />
          {/* <p>Selected Tag:</p>
          {
            selectedTag.map(e => {
              return (
                <li key={e.value}>
                  {e.label}
                </li>
              )
            })
          } */}
        </div>
        {actorid ? (
          <div className='add-participant'>
            <div className="add-participant-header">
              <div className="profile__avatar" >
                <img src="https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg" alt="" width="75px" height="75px" />
              </div>
              <div className="info">
                <h4>{actorname}</h4>
                <h6>{actoremail}</h6>
              </div>


            </div>
            {loading ? <Spinner /> : <button id='myBtn' className='btn' disabled={(btntxt === "Already friends") || (btntxt === "Sent!") ? true : false} onClick={sendRequest}>{btntxt}</button>}


          </div>)
          : (<img src={logo} alt="" />)}



      </div>


    </div>
  )
}

export default Home