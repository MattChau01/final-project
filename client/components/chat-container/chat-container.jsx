import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import ChatBoxReceiver, { ChatBoxSender } from './chat-box';
import SendMessage from './send-msg';

// import toast container into component
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

export default function ChatContainer(props) {

  const userName = window.location.hash.split('&')[2];
  const socketio = socketIOClient('http://localhost:3000');
  const [chats, setChats] = useState([]);
  const [user] = useState((props.user));

  useEffect(() => {
    socketio.on('chat', senderChats => {
      setChats(senderChats);
    });
  }, [socketio]);

  function sendChatToSocket(chat) {
    socketio.emit('chat', chat);
  }

  function addMessage(chat) {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        const timestamp = data[0].timestamp;
        const newChat = { ...chat, user, timestamp };
        setChats([...chats, newChat]);
        sendChatToSocket([...chats, newChat]);
      })
      .catch(err => console.error(err));
  }

  // function notifyUser() {
  //   console.log('toast!');
  //   toast('Messaged!', {
  //     position: 'top-right',
  //     autoClose: 2000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: 'light'
  //   });
  // }

  function ChatsLists() {
    return chats.map((chat, index) => {
      if (chat.user === userName) {
        // console.log('current user');
        return (
          <>
            <ChatBoxSender key={index} id={Date.now()} message={chat.message} user={chat.user} timeStamp={chat.time} tStamp={chat.timestamp}/>
            {/* <ToastContainer />; */}
          </>
        );
      }
      // console.log('other user');
      return (
        <>
          <ChatBoxReceiver key={index} id={Date.now()} message={chat.message} user={chat.user} timeStamp={chat.time} tStamp={chat.timestamp} />
          {/* <ToastContainer />; */}
        </>
      );
    });
  }

  return (
    <>
      {/* <div>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <p style={{ margin: 10, color: '#fff', backgroundColor: '#283C46' }} className='px-2 py-1' >
              Username: {props.user}
            </p>
          </div>
        </div>
      </div> */}
      <div className='mt-3'>
        <div className='chat-list'>
          <div>
            <div style={{ backgroundColor: '#283C46' }} className='scroll-bar mb-3' >
              <ChatsLists />
            </div>
            <SendMessage addMessage={addMessage} handleSubmit={props.handleSubmit} currentRoom={props.currentRoom} userName={props.userName} />
          </div>
        </div>
      </div>
    </>
  );
}
