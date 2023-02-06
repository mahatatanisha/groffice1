import React from 'react'
import '../cssfiles/chat.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SubgroupChatTab from './SubgroupChatTab';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';

function Chat() {
  return (
    <div className='chat'>
      <div className="chat_box">
        <div className="chat__header">
          <div className="profile__avatar" >
            <img src="https://as2.ftcdn.net/v2/jpg/01/77/38/91/1000_F_177389160_wNADdOYpPWAP64NXYKNjVBn52A0UC3dy.jpg" alt="" width="50px" height="50px" />
          </div>
          <div className='chat_headerInfo'>
            <h3 className='chat-room-name'>TYCS 22-23</h3>
            <p className='chat-room-last-seen'>
              Last seen at 43:00:23
            </p>
          </div>

        </div>
        <div className="sub-group">
          <SubgroupChatTab />
          <SubgroupChatTab />
          <SubgroupChatTab />
          <SubgroupChatTab />
        </div>
        <div className="chat__main">
          <p className="chat_message">
            <span className="chat_name">Tanisha</span>
            Hey!!
            <span className="chat_timestemp">Tue 14:23:76</span>
          </p>
        </div>

        <div className="chat__footer">
          <EmojiEmotionsOutlinedIcon />
          <form>
            <input placeholder="Type a message" />
            <button type="submit" > Send a Message</button>
          </form>
          <MicNoneOutlinedIcon />
        </div>
      </div>

    </div>

  )
}

export default Chat