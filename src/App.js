import React, { useState, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [streamer, setStreamer] = useState("");
  const [ws, setWs] = useState(null); // Adiciona o estado ws

  useEffect(() => {
    let newWs; // Move a declaração para o escopo mais amplo

    if (isConnected) {
      newWs = new WebSocket("ws://localhost:3001");

      newWs.onopen = () => {
        console.log("WebSocket connection opened");
      };

      newWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      };

      newWs.onclose = () => {
        console.log("WebSocket connection closed");
        setIsConnected(false);
        setWs(null);
      };

      setWs(newWs);
    } else {
      if (ws) {
        ws.close();
      }
    }

    return () => {
      if (newWs) {
        // Altera para newWs para garantir que a referência esteja correta
        newWs.close();
      }
    };
  }, [isConnected, streamer]);

  const handleConnect = async () => {
    try {
      const response = await fetch("http://localhost:3001/startConnection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamerChannelName: streamer }),
      });

      if (response.ok) {
        setIsConnected(true);
      } else {
        console.error("Failed to connect:", response.statusText);
      }
    } catch (error) {
      console.error("Error connecting:", error.message);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch("http://localhost:3001/stopConnection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamerChannelName: streamer }),
      });

      if (response.ok) {
        setIsConnected(false);
      } else {
        console.error("Failed to disconnect:", response.statusText);
      }
    } catch (error) {
      console.error("Error disconnecting:", error.message);
    }
  };

  const handleClean = () => {
    setMessages([]);
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
      <button onClick={handleClean}>Clean</button>

      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            [{msg.channel}] {msg.author}: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
