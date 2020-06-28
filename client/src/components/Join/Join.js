import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from './heart.svg';
import './Join.css';


const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('Music');

    return (
        <React.Fragment>
            <main className="flex-chat-page">
                <div className="flex-item left-panel" >
                    <div className="long-bg">
                    </div>
                </div>
                {/* right panel */}
                <div className="flex-item right-panel">
                    <div className="login-chat-block">
                        <div className="login-chat-header">
                            <h2>Chat Me <span><Logo className="the-logo" /></span></h2>
                        </div>
                        <div className="login-chat-body">
                            <div className="user-name-block">
                                <h4>Username</h4>
                                <input
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    name="name"
                                    placeholder="Enter your name" />
                            </div>
                            <div className="rooms-block">
                                <h4>
                                    <label htmlFor="room">Chatroom</label>
                                </h4>
                                <select
                                    value={room}
                                    onChange={(event) => setRoom(event.target.value)}
                                    name="room"
                                    id="room">
                                    <option value='Music'>Music</option>
                                    <option value='Coding'>Coding</option>
                                    <option value='Philosophy'>Philosophy</option>
                                </select>
                            </div>
                            <Link
                                to={name && room ? `/chat/?name=${name}&room=${room}` : ''}
                                className="enter-button"
                            >
                                Enter the Room
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </React.Fragment>
    )

}

export default Join
