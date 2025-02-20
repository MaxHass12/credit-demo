import Counter from './Counter.jsx';
import { useState, useCallback } from 'react';
import useSocket from '../useSocket.js';
import { OpCRDT as OpCRDTDataType } from '../CRDT.js';
import { JsonView } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { getTimeString } from '../utils.js';
import TableComponent from './TableComponent.jsx';

function OperationCRDT() {
  const [randomNumber, setRandomNumber] = useState('');
  const [crdt, _setCrdt] = useState(new OpCRDTDataType());
  const [_randomStateForRerender, setRandomStateForRerender] = useState(
    Math.random()
  );

  const handleRandomNumberReceived = useCallback((val) => {
    setRandomNumber(val);
  }, []);

  const handleInitialConnectResponse = useCallback(() => {}, []);

  const handleBroadcastReceived = useCallback(
    (payload) => {
      crdt.registerEvent(payload);
      setRandomStateForRerender(Math.random());
    },
    [crdt]
  );

  const { clientId, sendChangeInfo } = useSocket({
    type: 'OpCRDT',
    onRandomNumberReceived: handleRandomNumberReceived,
    onInitialConnectResponse: handleInitialConnectResponse,
    onBroadcastReceived: handleBroadcastReceived,
  });

  const handleCounterChange = (actionType) => {
    const timestamp = getTimeString();

    const changeInfo = {
      type: 'OpCRDT',
      payload: {
        timestamp,
        actionType,
        clientId,
      },
    };
    sendChangeInfo(changeInfo);
    crdt.registerEvent({ actionType, timestamp });
    setRandomStateForRerender(Math.random());
  };

  return (
    <div className="crdt-ctr">
      <div className="card-container">
        <h2>Operation Based CRDT</h2>
        {clientId && (
          <div>
            <p>Socket Connection Established. Client Id : {clientId}</p>
            <p> Random Number From Server : {randomNumber}</p>
          </div>
        )}
        <Counter
          value={crdt.getCounterValue()}
          onIncrease={() => handleCounterChange('INC')}
          onDecrease={() => handleCounterChange('DEC')}
        />{' '}
      </div>
      <div className="table-wrapper card-container">
        <h3>Operation History</h3>
        <TableComponent data={crdt.getHistory()} />
      </div>
    </div>
  );
}

export default OperationCRDT;
