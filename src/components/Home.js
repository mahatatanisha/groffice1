import React, { useState } from 'react';
import '../cssfiles/home.css';
import Profile from './Profile'
import logo from '../logogroffice.png';
import SearchIcon from '@mui/icons-material/Search';
import AsyncSelect from 'react-select/async';
import Sidebar from './Sidebar';
import { db } from "./firebase";
import { useNavigate } from 'react-router-dom';
import {

  collection,
  getDocs,
  endAt,
  query, orderBy, startAt
} from "firebase/firestore";

function Home() {

  const [selectedTag, setSelectedTag] = useState([]);
  const [userid, setUserId] = useState(null);
  const [username, setUserName] = useState(null);
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
            label: doc.data().name
          }
          recommendedTags.push(tag)
        });
        return resolve(recommendedTags)
      } else {

        return resolve([])
      }
    })

  }


  const navigate = useNavigate();
  const handleOnChange = (tags) => {
    setSelectedTag([tags])
    console.log(tags.value);
    //  navigate(`/home/search-user/${tags.value}`);
    setUserId(tags.value);
    setUserName(tags.label);
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
        {userid ? (
          <div className='add-participant'>
            <div className="add-participant-header">
              <div className="profile__avatar" >
                <img src="https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg" alt="" width="75px" height="75px" />
              </div>
              <h4>{username}</h4>
            </div>
            <button className='btn'>Send Request</button>

          </div>)
          : (<img src={logo} alt="" />)}



      </div>


    </div>
  )
}

export default Home