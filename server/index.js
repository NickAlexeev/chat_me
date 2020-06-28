const express = require('express');
const app = express();
const router = require('./express-router');
const moment = require('moment');
const PORT = process.env.PORT || 5000;
const { addUser, removeUser, currentUser, onlineUsers } = require('./utils');

// Router - Middleware
app.use(router);
// Socket
const server = app.listen(PORT, () => {
    console.log(`PORT is running on ${PORT}`);
})
const io = require('socket.io')(server);


// Handling sockets on server
io.on('connection', (socket) => {
    console.log('IO connected');
    // New user to push in the users arrray
    socket.on('newUser', (newUser) => {
        let theUser = {
            name: newUser.name.toLowerCase(),
            room: newUser.room.toLowerCase(),
            id: socket.id,
            time: moment().format('h:m:s a')
        }
        theUser = addUser(theUser);

        // 1.Emit only entered user
        socket.emit('welcome', ({
            name: theUser.name,
            msg: `${theUser.name} welcome to the ${theUser.room} room!`,
            time: moment().format('h:m:s a'),
            room: theUser.room
        }));
        // 2.Emit everyone except entered user
        socket.broadcast.to(theUser.room).emit('welcome', ({
            name: theUser.name,
            msg: `${theUser.name} just joined ${theUser.room} room!`,
            time: moment().format('h:m:s a'),
            room: theUser.room
        }))

        // 3.Join the chosen room 
        socket.join(theUser.room)

        // 4.Emit online users when entering the room
        const theOnlineUsers = onlineUsers(theUser.room);
        console.log('theOnlineUsers on server when user enters the room', theOnlineUsers)
        io.to(theUser.room).emit('onlineUsers', (theOnlineUsers))

    });


    // 5.Handling messages
    socket.on('message', (theMessage) => {
        console.log('theMessage', theMessage)
        io.to(theMessage.room).emit('theMessage', (theMessage))
    })

    // Disconnect
    socket.on('disconnect', () => {
        console.log('IO disconnected');
        // Handling user who left the room 
        const outOfTheRoomUser = currentUser(socket.id);
        if (outOfTheRoomUser) {
            socket.broadcast.to(outOfTheRoomUser.room).emit('disconnectedUser', ({
                name: outOfTheRoomUser.name.toUpperCase(),
                msg: `${outOfTheRoomUser.name} just left ${outOfTheRoomUser.room} room!`,
                time: moment().format('h:m:s a'),
                room: outOfTheRoomUser.room
            }))
            // Handling online users after user left the room 
            removeUser(socket.id);
            const theOnlineUsers = onlineUsers(outOfTheRoomUser.room);
            io.to(outOfTheRoomUser.room).emit('onlineUsers', (theOnlineUsers))
        }
    })
})

