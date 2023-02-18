import React from 'react'
import { Link, NavLink} from "react-router-dom";
import '../cssfiles/profile.css'
import WindowIcon from '@mui/icons-material/Window';
import SmsIcon from '@mui/icons-material/Sms';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useUserAuth } from "../context/UserAuthContext";
import Notifications from './Notifications';
function Profile() {
  const { user } = useUserAuth();

  return (
    <div className='profile'>
      <div className="profile_header">
        <div className="profile__avatar" >
          <img src="https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg" alt="" width="75px" height="75px" />
        </div>
        <h6>{user}</h6>
      </div>

      <div className="tabs">
        <ul>
          <li><NavLink activeclassname="active" to="/home"><WindowIcon fontSize='small' />  HOME</NavLink></li>
          <li><NavLink activeclassname="active" to="/chat"><SmsIcon fontSize='small' />  CHAT</NavLink></li>
          <li><NavLink activeclassname="active" to="/documents"><DescriptionIcon fontSize='small' />    DOCUMENTS</NavLink></li>
          <li><NavLink activeclassname="active" to="/notifications" onClick={<Notifications/>}><NotificationsIcon fontSize='small' />    NOTIFICATIONS</NavLink></li>
          <li><NavLink activeclassname="active" to="/settings"><SettingsIcon fontSize='small' />    SETTINGS</NavLink></li>

        </ul>

      </div>

      <div className="profile_footer">
        <Link to="/"><LogoutIcon fontSize='small' /> Log Out</Link>
      </div>
    </div>
  )
}

export default Profile