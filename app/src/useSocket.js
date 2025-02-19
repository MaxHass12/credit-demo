import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Connect to WebSocket server

function useSocket({
  type,
  onBroadcastReceived,
  onRandomNumberReceived,
  onInitialConnectResponse,
}) {
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    socket.emit('initialConnect', type);

    socket.on('initialConnectResponse', ({ clientId, serverState }) => {
      setClientId(clientId);
      onInitialConnectResponse(serverState);
    });

    socket.on('randomNumber', (val) => onRandomNumberReceived(val));

    socket.on('broadcast', onBroadcastReceived);

    return () => {
      socket.off('message');
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
