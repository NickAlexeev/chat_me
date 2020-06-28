let users = [];

const addUser = (theUser) => {
    console.log('theUser :', theUser)
    const userExists = users.some(user => user.name === theUser.name && user.room === theUser.room)
    if (!userExists) {
        users.push(theUser)
        console.log('users after push : ', users)
        return theUser
    }
    else {
        const theError = {
            error: 'User exists'
        }
        return theError
    }

}

const currentUser = (id) => {
    const currentUser = users.find(user => user.id === id)
    return currentUser;
}

const removeUser = (id) => {
    const userToRemove = users.find(user => user.id === id);
    users.splice(users.indexOf(userToRemove), 1)
}

const onlineUsers = (room) => {
    const theOnlineUsers = users.filter(user => user.room === room)
    console.log('onlineUsers when getting online users', theOnlineUsers)
    return theOnlineUsers
}


module.exports = { addUser, removeUser, currentUser, onlineUsers }


