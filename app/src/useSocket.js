import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const BASE_URL = window.location.url;
// const BASE_URL = 'http://localhost:3001';

function useSocket({
  type,
  onBroadcastReceived,
  onRandomNumberReceived,
  onInitialConnectResponse,
}) {
  const [socket, setSocket] = useState(null);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const socket = io(BASE_URL); // Connect to WebSocket server
    setSocket(socket);
    socket.emit('initialConnect', type);

    socket.on('initialConnectResponse', ({ clientId, serverState }) => {
      setClientId(clientId.slice(0, 6));
      onInitialConnectResponse(serverState);
    });

    socket.on('randomNumber', (val) => onRandomNumberReceived(val));

    socket.on('broadcast', (val) => {
      console.log('broadcast received', val);
      onBroadcastReceived(val);
    });

    return () => {
      socket.off('initialConnectResponse');
      socket.off('randomNumber');
      socket.off('broadcast');
      socket.disconnect(); // Properly disconnect on unmount
    };
  }, [
    type,
    onBroadcastReceived,
    onRandomNumberReceived,
    onInitialConnectResponse,
  ]);

  const sendChangeInfo = ({ type, payload }) => {
    socket.emit('changeInfo', { type, payload });
  };

  return { clientId, sendChangeInfo };
}

export default useSocket;
