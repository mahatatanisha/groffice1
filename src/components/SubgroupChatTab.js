import React from 'react'
import '../cssfiles/subgroupchattab.css'

function SubgroupChatTab() {
    return (
        <div className="subgroup">
            <div className="profile__avatar" >
                <img src="https://techcrunch.com/wp-content/uploads/2011/11/android_logo.gif?w=730&crop=1" alt="" width="20px" height="20px" />
            </div>
            <h3 className='chat-room-name'>Android</h3>
        </div>
    )
}

export default SubgroupChatTab