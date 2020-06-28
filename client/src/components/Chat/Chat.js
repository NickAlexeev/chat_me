import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from './heart.svg';
import { ReactComponent as ChatLogo } from './chat-logo.svg';
import { ReactComponent as Users } from './group.svg';
import { ReactComponent as SendIcon } from './send-message.svg';
import './Chat.css';
const moment = require('moment');

// Setting up Socket on a Front-End
const io = require('socket.io-client');
const localhost = 'http://localhost:5000';

const Chat = ({ location }) => {
    const [enteredUser, setEnteredUser] = useState('');
    const [enteredRoom, setEnteredRoom] = useState('');
    const [welcomeUser, setWelcomeUser] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState('');
    const socket = io.connect(localhost);



    // 1 Initial connection and disconnection
    useEffect(() => {
        console.log('onlineUsers', onlineUsers)
        // const socket = io.connect(localhost);
        const { name, room } = queryString.parse(location.search);
        setEnteredUser(name);
        setEnteredRoom(room);

        socket.emit('newUser', ({ name, room }), (error) => {
            console.error('error on client');
        });

        return () => {
            socket.disconnect();
        }
    }, []);


    // 2 Handling welcome, new user messages.
    useEffect(() => {
        socket.on('welcome', (user) => {
            console.log('user  on welcome || left ', user)
            if (user.name) {
                setWelcomeUser(oldstate => [...oldstate, user])
            }
        })
    });


    //  3 Handling user left message
    useEffect(() => {
        socket.on('disconnectedUser', (lefUser) => {
            console.log('disconnectedUser is :', lefUser)
            setWelcomeUser(oldstate => [...oldstate, lefUser])
        })
    });


    // 4 Handling online users
    useEffect(() => {
        socket.on('onlineUsers', (theOnlineUsers) => {
            console.log('onlineUsers', theOnlineUsers)
            // setOnlineUsers(prevOnlineUsers => [...prevOnlineUsers, theOnlineUsers])
            setOnlineUsers(theOnlineUsers)
        })
    });

    // 5 Handling sending meesage
    const sendMessage = () => {
        const theMessage = {
            name: enteredUser.toLowerCase(),
            room: enteredRoom.toLowerCase(),
            msg: inputValue,
            time: moment().format('h:m:s a')
        }
        socket.emit('message', (theMessage))
    };

    // 6 Handling recieved message from socket
    useEffect(() => {
        socket.on('theMessage', (theMessage) => {
            console.log('theMessage', theMessage)
            setMessages(prevMessage => [...prevMessage, theMessage])
        })
    })


    return (
        <main className="main-block" >
            <div className="flex-main">
                {/* flex-header */}
                <div className="flex-item flex-header">
                    <h3>Chat&Me<Logo className="logo-header" /></h3>
                    <Link to={'/'} className="leave-room-button">Leave Room</Link>
                </div>
                {/* flex-body */}
                <div className="flex-item flex-body">
                    {/* flex-body-nav */}
                    <div className="flex-body-nav">
                        <h3><ChatLogo className="logo-nav" />Room:</h3>
                        <p>{enteredRoom}</p>
                        {/* Online Users */}
                        <h3><Users className="logo-nav" />Users:</h3>
                        {onlineUsers.length ?
                            onlineUsers.map((user, index) => <p className="first-capital-case" key={index}>{user.name}</p>)
                            : null}
                    </div>
                    {/* flex-body-chat */}
                    <div className="flex-body-chat">
                        {/* Welcome message */}
                        {welcomeUser.length > 0 ?
                            welcomeUser.map((user, index) => {
                                return (
                                    <div key={index} className="flex-body-chat-message">
                                        <h5><span>{user.time}</span></h5>
                                        <p className="first-capital-case">{user.msg}</p>
                                    </div>
                                )
                            }) : null
                        }
                        {/* Messages */}
                        {messages.length ? messages.map((message, index) => {
                            return (
                                <div key={index} className="flex-body-chat-message">
                                    <h5>{message.name}<span>{message.time}</span></h5>
                                    <p>{message.msg}</p>
                                </div>
                            )
                        }) : null}
                    </div>
                </div>
                {/* flex-footer */}
                <div className="flex-item flex-footer">
                    <div className="footer-wrapper">
                        <input
                            onKeyPress={(event) => event.key === "Enter" ? sendMessage() : null}
                            onChange={(event) => setInputValue(event.target.value)}
                            className="send-message-input"
                            placeholder="Enter message" />
                        <button
                            onClick={sendMessage}
                            className="send-message-button"><SendIcon className="send-message-icon" /></button>

                    </div>
                </div>
            </div>
        </main >
    )
}

export default Chat