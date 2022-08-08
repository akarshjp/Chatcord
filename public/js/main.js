const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
// const userList = document.getElementById('users');



//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true // to not take symbols from URL 
})

//console.log(username, room)
const socket = io()

//JOin chat room
socket.emit ('joinRoom', {username, room})

// //Get room and users
socket.on('roomUsers', ({room, users})=>
    {
        outputRoomName(room);
        //outputUsers(users);
    })

socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    //Scrolls down 
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Message submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    //get message text
    const msg = e.target.elements.msg.value; //msg is the id in html for message in chat.html under form chat-form

    //console.log(msg);

    //emitting a message to the server
    socket.emit('chatMessage', msg)

    //clear input of the last message typed
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus(); //focusses on input
})

//Output message to DOM, meaning instead of showing message in console, 
//we need to put it in the chat bubble using DOM manipulation
function outputMessage(message)
{
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`

    document.querySelector('.chat-messages').appendChild(div); //this will create a new chat bubble with the message

}

//Add room name to DOM
function outputRoomName(room)
{
    roomName.innerText = room;
}
// //Add user to DOM
// function outputUsers(users)
// {
//     userList.innerHTML = `
//         ${users.map(user => `<li>${user.username}</li>`).join()}
//     `;
// }