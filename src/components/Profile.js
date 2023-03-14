import React, { useRef, useState, useEffect } from 'react'
import { Link, NavLink } from "react-router-dom";
import '../cssfiles/profile.css'
import upload from 'D:/ReactApp/groffice/src/upload.png'
import WindowIcon from '@mui/icons-material/Window';
import SmsIcon from '@mui/icons-material/Sms';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useUserAuth } from "../context/UserAuthContext";
import Notifications from './Notifications';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { ImageUpload } from './ImageUpload';
import {
  collection,
  getDocs,


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
import { db } from "./firebase";
import Spinner from './Spinner';
import noNotification from 'D:/ReactApp/groffice/src/nonotification.png'
import { async } from '@firebase/util';

function Profile() {

  function useComponentVisible(initialIsVisible) {
    const [isComponentVisible, setIsComponentVisible] = useState(
      initialIsVisible
    );
    const ref1 = useRef(null);

    const handleHideDropdown = (event) => {
      if (event.key === "Escape") {
        setIsComponentVisible(false);
      }
    };

    const handleClickOutside = event => {
      if (ref1.current && !ref1.current.contains(event.target)) {
        setIsComponentVisible(false);
        setShow(false);
      }
    };

    useEffect(() => {
      document.addEventListener("keydown", handleHideDropdown, true);
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("keydown", handleHideDropdown, true);
        document.removeEventListener("click", handleClickOutside, true);
      };
    });

    return { ref1, isComponentVisible, setIsComponentVisible };
  }

  const {
    ref1,
    isComponentVisible,
    setIsComponentVisible
  } = useComponentVisible(true);

  useEffect(() => {
    listAllDocuments();
  }, [flag]);

  const { user, userid } = useUserAuth();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showModals, setShowModals] = useState(false);
  const [flag, setFlag] = useState(false);


  const storage = getStorage();

  const actonotificationRef = collection(db, `/Users/${userid}/Notifications`);

  const getAllNotifications = () => {
    return getDocs(actonotificationRef);
  }

  const getNoti = async () => {
    setLoading(true);
    const notidata = await getAllNotifications();
    setNotifications(notidata.docs.map((doc) => ({
      id: doc.id,
      notifier: doc.data().Notifier,
      value: doc.data().Value,
      notifierName: doc.data().NotifierName,
      response: doc.data().Response

    })))
    setLoading(false);
  }

  const openModals = () => {
    setShowModals(prev => !prev);
  };
  const listRef = ref(storage, `${userid}/profilePic`);

  const listAllDocuments = () => {
    listAll(listRef)
      .then((res) => {

        res.items.forEach((itemRef) => {

          getMetadata(ref(storage, `${userid}/profilePic/${itemRef.name}`))
            .then((metadatas) => {
              console.log("profile pic", metadatas.fullPath);
              getDownloadURL(ref(storage, metadatas.fullPath))
                .then((url) => {
                  const img = document.getElementById('document');
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

  const uploadFile = async (e) => {
    const fileName = e.target.files[0];
    const metadata = {
      customMetadata: {
        name: user,
        userId: userid,

      },
    };
    listAll(listRef).then((res)=>{
      res.items.forEach(async (itemRef) => {
        const desertRef = ref(storage, `${userid}/profilePic/${itemRef.name}`);
        await deleteObject(desertRef).then(()=>{
          console.log("pics deleted")
        })
      })

    }).then(async ()=>{
      if (fileName == null) return;
      const imageRef = ref(storage, `${userid}/profilePic/${fileName.name}`);
      await uploadBytes(imageRef, fileName, metadata).then(() => {
        alert("Profile picture updated");
        setFlag(true);
      });
    })
    

   
    // if (fileName == null) return;
    // const imageRef = ref(storage, `${userid}/profilePic/${fileName.name}`);
    // await uploadBytes(imageRef, fileName, metadata).then(() => {
    //   alert("Profile picture updated");
    // });



  };



  return (
    <div className='profile'>
      <div className="profile_header">
      
        <div className="profile__avatar" onClick={openModals} >
          
          <div className='img2 image'><img src="https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg" alt="" width="75px" height="75px" /></div>
          <div className='img2 image'><img id='document' alt="" width="75px" height="75px" /></div>
          <div className='img1 image'><img src={upload} alt="upload" width="75px" height="75px" /></div>
          <div className='camera image'><PhotoCameraIcon className='cameraog' /></div>
          <div className="camera image input"><input type="file" onChange={(event) => {
            uploadFile(event);


          }} /></div>
          
        </div>

        {/* <ImageUpload showModals={showModals} setShowModals={setShowModals} /> */}
        <h6>{user}</h6>
      </div>

      <div className="tabs">
        <ul>
          <li><NavLink activeclassname="active" to="/home"><WindowIcon fontSize='small' />  HOME</NavLink></li>
          <li><NavLink activeclassname="active" to="/chat"><SmsIcon fontSize='small' />  CHAT</NavLink></li>
          <li><NavLink activeclassname="active" to="/documents"><DescriptionIcon fontSize='small' />    DOCUMENTS</NavLink></li>
          <li onClick={() => { setShow(!show); setIsComponentVisible(true); getNoti(); }} className={`noti-list ${show ? 'noti-list-active' : ''}`}><NotificationsIcon fontSize='small' />    NOTIFICATIONS</li>
          <li><NavLink activeclassname="active" to="/settings"><SettingsIcon fontSize='small' />    SETTINGS</NavLink></li>

        </ul>

      </div>
      {/* ref={tooltipRef} style={styles.popper} {...attributes.popper} */}




      {isComponentVisible && show && <div className='demo' ref={ref1} >
        {(notifications.length == 0) ? <img src={noNotification} alt="no notifications" /> : ""}
        {loading ? <Spinner /> : notifications.map(noti => (
          <Notifications key={noti.id} id={noti.id} value={noti.value} notifierName={noti.notifierName} notifierid={noti.notifier} response={noti.response} />
        ))}

      </div>}

      <div className="profile_footer">
        <Link to="/"><LogoutIcon fontSize='small' /> Log Out</Link>
      </div>
    </div>
  )
}

export default Profile