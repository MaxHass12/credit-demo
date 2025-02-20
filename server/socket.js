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
      socket.emit('randomNumber', Math.floor(Math.random() * 1000));
    }, 15000);

    socket.on('changeInfo', ({ type, payload }) => {
      let newServerState;
      if (type === 'OT') {
        if (payload.actionType === 'INC') {
          newServerState = serverState + 1;
        } else if (payload.actionType === 'DEC') {
          newServerState = serverState - 1;
        }
        serverState = newServerState;
        const delay = 0;
        setTimeout(() => {
          io.emit('broadcast', { serverState: newServerState });
        }, delay);
      }

      if (type === 'OpCRDT') {
        const delay = Math.floor(Math.random() * 5000);
        setTimeout(() => {
          socket.broadcast.emit('broadcast', payload);
        }, delay);
      }

      if (type === 'StateCRDT') {
        const delay = Math.floor(Math.random() * 5000);

        setTimeout(() => {
          socket.broadcast.emit('broadcast', payload);
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
