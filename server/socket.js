import { Server } from 'socket.io';

let serverState = 0;

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: '*' }, // Allow frontend connections
  });

  io.on('connection', (socket) => {
    console.log('client connected', socket.id);

    socket.emit('initialConnectResponse', { clientId: socket.id, serverState });

    setInterval(() => {
      socket.emit('randomNumber', Math.random());
    }, 5000);

    socket.on('changeInfo', ({ type, payload }) => {
      if (type === 'OT') {
        if (payload.actionType === 'INC') {
          serverState += 1;
        } else if (payload.actionType === 'DEC') {
          serverState -= 1;
        }
        console.log(serverState);
        io.emit('broadcast', { serverState });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io; // Return the Socket.IO instance if needed
};

export default setupSocket;
