import Counter from './Counter.jsx';
import { useState, useCallback } from 'react';
import useSocket from '../useSocket.js';
import { OpCRDT as OpCRDTDataType } from '../CRDT.js';
import { JsonView } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

function OperationCRDT() {
  const [randomNumber, setRandomNumber] = useState('');
  const [clientState, setClientState] = useState(new OpCRDTDataType());
  const [randomStateForRerender, setRandomStateForRerender] = useState(
    Math.random()
  );

  const handleRandomNumberReceived = useCallback((val) => {
    setRandomNumber(val);
  }, []);

  const handleInitialConnectResponse = useCallback((serverState) => {}, []);

  const handleBroadcastReceived = useCallback((val) => {
    clientState.addEventToState(val);
    setRandomStateForRerender(Math.random());
  }, []);

  const { clientId, sendChangeInfo } = useSocket({
    type: ' OperationCRDT',
    onRandomNumberReceived: handleRandomNumberReceived,
    onInitialConnectResponse: handleInitialConnectResponse,
    onBroadcastReceived: handleBroadcastReceived,
  });

  const handleCounterChange = (actionType) => {
    const changeInfo = {
      type: 'OpCRDT',
      payload: {
        timestamp: Date.now().toString(),
        changeType: actionType,
      },
    };
    sendChangeInfo(changeInfo);
  };

  return (
    <div>
      <h2>Operational Transformation</h2>
      {clientId && (
        <div>
          <p>
            Socket Connection Established. Client Id : {clientId.slice(0, 6)}
          </p>
          <p> Random Number From Server : {randomNumber}</p>
        </div>
      )}
      <Counter
        value={clientState.getVisibleState()}
        onIncrease={() => handleCounterChange('INC')}
        onDecrease={() => handleCounterChange('DEC')}
      />{' '}
      <div>
        <h3>Client State</h3>
        <JsonView data={clientState.getState()} />
      </div>
    </div>
  );
}

export default OperationCRDT;
