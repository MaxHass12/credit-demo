import Counter from './Counter';
import { useState, useCallback } from 'react';
import useSocket from '../useSocket';

function OperationalTransformation() {
  const handleRandomNumberReceived = useCallback((val) => {
    setRandomNumber(val);
  }, []);

  const handleInitialConnectResponse = useCallback((serverState) => {
    setClientState(serverState);
  }, []);

  const handleBroadcastReceived = useCallback(({ serverState }) => {
    setClientState(serverState);
  }, []);

  const { clientId, sendChangeInfo } = useSocket({
    type: 'OT',
    onRandomNumberReceived: handleRandomNumberReceived,
    onInitialConnectResponse: handleInitialConnectResponse,
    onBroadcastReceived: handleBroadcastReceived,
  });
  const [clientState, setClientState] = useState('');
  const [randomNumber, setRandomNumber] = useState('');

  const handleCounterChange = (type) => {
    let changeInfoToSend;
    if (type === 'INC') {
      changeInfoToSend = { type: 'OT', payload: { actionType: 'INC' } };
      setClientState((prevState) => prevState + 1);
    } else if (type === 'DEC') {
      changeInfoToSend = { type: 'OT', payload: { actionType: 'DEC' } };
      setClientState((prevState) => prevState - 1);
    }
    sendChangeInfo(changeInfoToSend);
  };

  return (
    <div className="card-container">
      <h2>Operational Transformation (Not CRDT)</h2>
      {clientId && (
        <div>
          <p>
            Socket Connection Established. Client Id : {clientId.slice(0, 6)}
          </p>
          <p> Random Number From Server : {randomNumber}</p>
        </div>
      )}
      <Counter
        value={clientState}
        onIncrease={() => handleCounterChange('INC')}
        onDecrease={() => handleCounterChange('DEC')}
      />{' '}
      <div>
        <p>Client State : {clientState}</p>
      </div>
    </div>
  );
}

export default OperationalTransformation;
