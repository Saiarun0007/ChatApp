const socket =io('http://localhost:8000');



const form=document.getElementById('send-container')
const messageInput =document.getElementById('messageInp')
const messageContainer =document.querySelector(".container")

var audio=new Audio('thing.mp3');

//append function append to the container
const append=(message,position)=>{
    const messageElement =document.createElement('div')
    messageElement.innerText=message;
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement)
    if(position =='left'){

        audio.play();

    }
        
}



form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message= messageInput.value;
    append(`you: ${message}`,'right');
    socket.emit('send',message)
    messageInput.value ='';
})










//to enter the name for the new user to join

const name1 = prompt("Enter your name to join");
socket.emit('new-user-joined',  name1);

//if new user joins let the server  know

socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right' )

}) 

socket.on('receive',data=>{
    append(`${data.name}:${data.message} `,'left' )

}) 
socket.on('leave',name=>{
    append(`${name} left the chat `,'left' )

}) 