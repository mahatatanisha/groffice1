import React, {useState} from 'react';
import '../cssfiles/home.css';
import Profile from './Profile'
import logo from '../logogroffice.png';
import SearchIcon from '@mui/icons-material/Search';
import AsyncSelect from 'react-select/async';
import { db } from "./firebase";

function Home() {

  const [selectedTag, setSelectedTag] = useState([]);

 const loadOptions = async (inputValue) => {
    inputValue = inputValue.toLowerCase().replace(/\W/g, "");
    return new Promise((resolve => {
            db.collection('Users')
                .orderBy('name')
                .startAt(inputValue)
                .endAt(inputValue + "\uf8ff")
                .get()
                .then(docs => {
                    if (!docs.empty) {
                        let recommendedTags = []
                        docs.forEach(function (doc) {
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

        })
    )
}

const handleOnChange = (tags) => {
  setSelectedTag([tags])
}

  return (
    <div className='home'>
      <Profile />
      <div className="icon">
        <h1>Welcome Back!</h1>
        <div className="search">
          <div className="container">

            <div className="row height d-flex justify-content-center align-items-center">

              <div className="">

                <div className="form">
                  <i className="fa fa-search"></i>
                  <input type="text" className="form-control form-input" placeholder="Search Users..." />
                  <span className="left-pan"><i className="fa fa-search"> <SearchIcon /></i></span>
                </div>

              </div>

            </div>

          </div>
        </div>
        <img src={logo} alt="" />
       
      </div>
      <div>
        <AsyncSelect
            loadOptions={loadOptions}
            onChange={handleOnChange}
        />
        <p>Selected Tag:</p>
         {
            selectedTag.map(e => {
                return (
                    <li key={e.value}>
                        {e.label}
                    </li>
                )
            })
        }
  </div>

    </div>
  )
}

export default Home