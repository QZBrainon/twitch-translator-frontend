import { useState, useEffect } from "react";
import io from "socket.io-client";

function App() {
  const [messages, setMessages] = useState([]);
  const [streamer, setStreamer] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="App">
      <label>
        Streamer:
        <input
          type="text"
          value={streamer}
          onChange={(e) => setStreamer(e.target.value)}
        />
      </label>
      {isConnected ? (
        <button onClick={handleDisconnect}>Disconnect</button>
      ) : (
        <button onClick={handleConnect}>Connect</button>
      )}
      <ul>
        {messages.map((msg) => (
          <li key={msg.username}>
            {msg.username}:{msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
