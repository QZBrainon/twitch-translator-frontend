import { useState, useEffect } from "react";
import io from "socket.io-client";

function App() {
  const [messages, setMessages] = useState([]);
  const [streamer, setStreamer] = useState("");

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
      <button>Connect</button>
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
