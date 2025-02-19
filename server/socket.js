import { Server } from 'socket.io';

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: '*' }, // Allow frontend connections
  });

  io.on('connection', (socket) => {
    console.log('Socket.IO client connected. Client ID:', socket.id);

    socket.on('message', (msg) => {
      console.log('Received:', msg, '. Client Id:', socket.id);
      socket.emit('message', 'Message received!');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io; // Return the Socket.IO instance if needed
};

export default setupSocket;
