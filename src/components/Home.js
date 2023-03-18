import React, { useState, useEffect } from 'react';
import '../cssfiles/home.css';
import Profile from './Profile'
import logo from '../logogroffice.png';
import AsyncSelect from 'react-select/async';
import Spinner from './Spinner';
import { db } from "./firebase";
import { useUserAuth } from "../context/UserAuthContext";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DescriptionIcon from '@mui/icons-material/Description';

import {
  collection,
  getDocs,
  endAt,
  query, orderBy, startAt, addDoc
} from "firebase/firestore";
import {
  ref,
  getStorage,
  uploadBytes,
  deleteObject,
  getMetadata,
  listAll,
  getDownloadURL,

} from "firebase/storage";
import { storage } from "./firebase";

function Home() {



  const [selectedTag, setSelectedTag] = useState(false);
  const [btntxt, setbtntxt] = useState("Send Request");
  const [actorid, setActorId] = useState(null);
  const [actorname, setActorName] = useState(null);
  const [actoremail, setActorEmail] = useState(null);
  const { userid, user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [imageurl, setImageUrl] = useState("");
  const [fileNames, setFileNames] = useState([]);

  const usersCollectionRef = collection(db, "Users");
  const storage = getStorage();


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
    await listProfileIcons(tags.value);
    await listActorDocuments(tags.value);
    

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

  const listProfileIcons = async (actorid) => {
    const listRef = ref(storage, `${actorid}/profilePic`);
    listAll(listRef)
      .then((res) => {

        res.items.forEach((itemRef) => {

          getMetadata(ref(storage, `${actorid}/profilePic/${itemRef.name}`))
            .then((metadatas) => {
              console.log("profile pic", metadatas.fullPath);
              getDownloadURL(ref(storage, metadatas.fullPath))
                .then((url) => {
                  const img = document.getElementById('document2');
                  setImageUrl(url)
                  img.setAttribute('src', url);
                })

            })
            .catch((error) => {
              // Uh-oh, an error occurred!
            });

        });



      }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log("Uh-oh, an error occurred!");
      });
  }


  // Find all the prefixes and items.
  const listActorDocuments =async (actorid) => {
    setFileNames([]);
    const listRef = ref(storage, `${actorid}/`);
      listAll(listRef)
          .then((res) => {

              res.items.forEach((itemRef) => {

                  getMetadata(ref(storage, `${actorid}/${itemRef.name}`))
                      .then((metadatas) => {
                        
                          if(metadatas.customMetadata.mode === 'Public'){
                            setFileNames((oldArray) => [...oldArray, {
                              Name: itemRef.name,
                              size: metadatas.size,
                              type: metadatas.type,
                          }]);
                          }
                         
                      })
                      .catch((error) => {
                          // Uh-oh, an error occurred!
                      });

              });



          }).catch((error) => {
              // Uh-oh, an error occurred!
              console.log("Uh-oh, an error occurred!");
          });
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
                {/* <img    alt="" /> */}
                <img id='document2' src="https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg" alt="" width="75px" height="75px" />
              </div>
              <div className="info">
                <h4>{actorname}</h4>
                <h6>{actoremail}</h6>
              </div>
            

            </div>
            {loading ? <Spinner /> : <button id='myBtn' className='btn' disabled={(btntxt === "Already friends") || (btntxt === "Sent!") ? true : false} onClick={sendRequest}>{btntxt}</button>}
            <table className='table-content'>
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Size</th>
                    <th scope="col">Type</th>
                    <th scope="col">Download</th>


                  </tr>
                </thead>
                <tbody>

                {fileNames.map((file) => (
                   <tr >
                   <th scope="row"> <DescriptionIcon /> {file.Name}</th>
                   <td>90kb</td>
                   <td>file</td>
                   <td><FileDownloadIcon /></td>

                 </tr>

                ))}

                 



                </tbody>


              </table>

          </div>)
          : (<img src={logo} alt="" />)}



      </div>


    </div>
  )
}

export default Home