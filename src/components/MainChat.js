import React from 'react'
import Chat from './Chat'
import Profile from './Profile'
import Sidebar from './Sidebar'

function MainChat() {
  return (
    <div className='app_body'>
        <Profile/>
        <Sidebar/>
        <Chat/>
    </div>
  )
}

export default MainChat