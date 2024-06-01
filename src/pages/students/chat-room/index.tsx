import React, { useState, useEffect, useContext }  from 'react';
import './chat-room.css';

import StudentLayout from '../../../components/StudentLayout/StudentLayout';



function Index() {

    return (
        <StudentLayout title="Chat Room" pageTitle="Chats">
      <div className="section">

            <div className="chat-container">
               <div className="left">
                <h1 className="chat-title">Conversation</h1>
               <div className="messages-section">
                    <div className="message-box sender">
                        <p>Hello ! How are you doing  ?</p>
                    </div>
                    <div className="message-box receiver">
                        <p>Am fine thanks and you ?</p>
                    </div>
                    <div className="message-box receiver">
                        <p>Am fine thanks and you ?</p>
                    </div>
                    <div className="message-box sender">
                        <p>Hello ! How are you doing ?</p>
                    </div>
                    <div className="message-box receiver">
                        <p>Am fine thanks and you ?</p>
                    </div>
                </div>
                <div className="send-box">
                    <input type="text" placeholder="Enter message..." id="" />
                   <button className="send-btn">Send</button>
                </div>
               </div>
               <div className="right">
                   
               </div>
            </div>
        </div>

        </StudentLayout>
    );
}

export default Index;