const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')


// Set static forlders
app.use(express.static(path.join(__dirname, 'public')))
const botName = 'ChatCord Bot';

//Run when a client connects
io.on('connection', socket =>{

   socket.on('joinRoom',({username, room}) =>{

    const user = userJoin(socket.id, username, room)
    socket.join(user.room)

    //Welcome current user
    socket.emit('message', formatMessage(botName,'Welcome to Chatcord')) //to a sinlge client

    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`)); //braodcast to everyone other than the user

    //send users and room info

    io.to(user.room).emit('roomUsers', {
        room: user.room,
        user: getRoomUsers(user.room)
    })

   }) 
   
    
    //Listen to chat Messages
    socket.on('chatMessage', (msg)=>{
        //console.log(msg); server can see the message(in the vscode terminal) 
        //now we need to emit the message to everyone 
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username,msg))

    })  

    //Runs when client disconnects
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id)

        if(user)
        {
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`))

            //When user disconnects we have to show the revised list of users in the room
            io.to(user.room).emit('roomUsers', {
            room: user.room,
            user: getRoomUsers(user.room)
        })
      
        }
        
    })
})
const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
