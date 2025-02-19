import { useState } from 'react';
import SocketComponent from './components/SocketComponent';

function App() {
  // const [type, setType] = useState('');
  return (
    <div>
      <h1>Web Socket</h1>
      <SocketComponent />
    </div>
  );
}

export default App;
