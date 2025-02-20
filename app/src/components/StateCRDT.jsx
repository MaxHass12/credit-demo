import Counter from './Counter.jsx';
import { useState, useCallback } from 'react';
import useSocket from '../useSocket.js';
import { StateCRDT as StateCRDTDataType } from '../CRDT.js';
import 'react-json-view-lite/dist/index.css';
import TableComponent from './TableComponent.jsx';

function StateCRDT() {
  const [randomNumber, setRandomNumber] = useState('');
  const [crdt, _setCrdt] = useState(new StateCRDTDataType());
  const [_randomStateForRerender, setRandomStateForRerender] = useState(
    Math.random()
  );

  const handleRandomNumberReceived = useCallback((val) => {
    setRandomNumber(val);
  }, []);

  const handleInitialConnectResponse = useCallback(() => {}, []);

  const handleBroadcastReceived = useCallback(
    (payload) => {
      console.log('received broadcast for stateCRDT', payload);
      crdt.merge(payload);
      setRandomStateForRerender(Math.random());
    },
    [crdt]
  );

  const { clientId, sendChangeInfo } = useSocket({
    type: 'StateCRDT',
    onRandomNumberReceived: handleRandomNumberReceived,
    onInitialConnectResponse: handleInitialConnectResponse,
    onBroadcastReceived: handleBroadcastReceived,
  });

  const handleCounterChange = (actionType) => {
    const newState = crdt.registerEvent(actionType);
    sendChangeInfo({ type: 'StateCRDT', payload: { clientId, ...newState } });
    setRandomStateForRerender(Math.random());
  };

  return (
    <div className="crdt-ctr">
      <div className="card-container">
        <h2>State Based CRDT</h2>
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
        <h3>State History</h3>
        <TableComponent data={crdt.getHistory()} />
      </div>
    </div>
  );
}

export default StateCRDT;
