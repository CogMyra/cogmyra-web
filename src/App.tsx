import React, { useState } from 'react';
import { apiFetch } from './lib/api';

function App() {
  const [reply, setReply] = useState<string>('');

  const handleSend = async () => {
    try {
      const res = await apiFetch('/health');
      const data = await res.json();
      setReply(JSON.stringify(data));
    } catch (err) {
      setReply('Error: ' + (err as Error).message);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>CogMyra — Private Beta</h1>
      <input type="text" placeholder="Ask something…" />
      <button onClick={handleSend}>Send</button>
      <div>
        <strong>Reply:</strong> {reply}
      </div>
    </div>
  );
}

export default App;
