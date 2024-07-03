const { Server } = require('socket.io'); // Use the correct import for Socket.IO v4

const express = require('express'); // Import Express for a minimal server
const cors = require('cors'); // Import the cors package

const app = express(); // Create an Express app
const httpServer = app.listen(8000); // Start the server on port 8000

// Configure CORS middleware (consider more restrictive origins in production)
const corsOptions = {
  origin: 'http://127.0.0.1:5500', // Allow requests from this origin (localhost:5500 for development)
  credentials: true, // Allow cookies for authentication (if applicable)
};
app.use(cors(corsOptions)); // Apply CORS middleware to the Express app

const io = new Server(httpServer, {
  cors: {
    origin: corsOptions.origin,
    credentials: corsOptions.credentials,
  },
});

const users = {};

io.on('connection', (socket) => {

  // if any new user joins ,let other user connected to the server know!
  socket.on('new-user-joined', (name) => {
    console.log("New user joined:", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  //if someone sends a message ,broadcast it  to other people

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message, name: users[socket.id] });
  });

  //if someone leaves the chat, let other know

  socket.on('disconnect', (message) => {
    socket.broadcast.emit('leave', users[socket.id] );
    delete users[socket.id];
  });

});
