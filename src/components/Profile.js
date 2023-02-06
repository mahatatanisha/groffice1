import React from 'react'
import '../cssfiles/profile.css'
import WindowIcon from '@mui/icons-material/Window';
import SmsIcon from '@mui/icons-material/Sms';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
function Profile() {
  return (
    <div className='profile'>
      <div className="profile_header">
        <div className="profile__avatar" >
          <img src="https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg" alt="" width="75px" height="75px" />
        </div>
        <h6>Mathur Sinha</h6>
      </div>

      <div className="tabs">
        <ul>
          <li><a href=""><WindowIcon fontSize='small' />  HOME</a></li>
          <li><a href=""><SmsIcon fontSize='small' />  CHAT</a></li>
          <li><a href=""><DescriptionIcon fontSize='small' />    DOCUMENTS</a></li>
          <li><a href=""><NotificationsIcon fontSize='small' />    NOTIFICATIONS</a></li>
          <li><a href=""><SettingsIcon fontSize='small' />    SETTINGS</a></li>

        </ul>

      </div>

      <div className="profile_footer">
        <a href=""><LogoutIcon fontSize='small' /> Log Out</a>
      </div>
    </div>
  )
}

export default Profile