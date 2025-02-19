import { useState } from 'react';
import TypeSelectedInput from './components/TypeSelectInput';
import OperationalTransformation from './components/OperationalTransformation';
import OperationCRDT from './components/OperationCRDT';
import StateCRDT from './components/StateCRDT';

function App() {
  const [type, setType] = useState(() => {
    let typeInLocalStorage = window.localStorage.getItem('CRDT_TYPE');

    if (!typeInLocalStorage) {
      window.localStorage.setItem('CRDT_TYPE', 'OT');
      typeInLocalStorage = 'OT';
    }
    return typeInLocalStorage;
  });

  const handleTypeChange = (val) => {
    setType(val);
    window.localStorage.setItem('CRDT_TYPE', val);
  };

  return (
    <div className="main-ctr">
      <TypeSelectedInput selectedOption={type} onChange={handleTypeChange} />
      {type === 'OT' && <OperationalTransformation />}
      {type === 'OpCRDT' && <OperationCRDT />}
      {type === 'StateCRDT' && <StateCRDT />}
    </div>
  );
}

export default App;
