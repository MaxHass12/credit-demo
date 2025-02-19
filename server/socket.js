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
    }, 10000);

    socket.on('changeInfo', ({ type, payload }) => {
      if (type === 'OT') {
        if (payload.actionType === 'INC') {
          serverState += 1;
        } else if (payload.actionType === 'DEC') {
          serverState -= 1;
        }
        io.emit('broadcast', { serverState });
      }

      if (type === 'OpCRDT') {
        // const delay = 0;
        const delay = Math.floor(Math.random() * (2000 - 100 + 1)) + 100;
        setTimeout(() => {
          io.emit('broadcast', payload);
        }, delay);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io; // Return the Socket.IO instance if needed
};

export default setupSocket;
