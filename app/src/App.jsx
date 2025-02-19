import { useState } from 'react';
import TypeSelectedInput from './components/TypeSelectInput';
import OperationalTransformation from './components/OperationalTransformation';

function App() {
  const [type, setType] = useState('OT');

  return (
    <div>
      <TypeSelectedInput
        selectedOption={type}
        onChange={(value) => setType(value)}
      />
      {type === 'OT' && <OperationalTransformation />}
    </div>
  );
}

export default App;
