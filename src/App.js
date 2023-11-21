import React, { useState, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [streamer, setStreamer] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (isConnected) {
      // Establish WebSocket connection when isConnected is true
      const newWs = new WebSocket("ws://localhost:3001"); // Replace with your WebSocket server URL

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
      };

      setWs(newWs);
    } else {
      // Close WebSocket connection when isConnected is false
      if (ws) {
        ws.close();
        setWs(null);
      }
    }

    // Clean up WebSocket on component unmount
    return () => {
      if (ws) {
        ws.close();
        setWs(null);
      }
    };
  }, [isConnected]);

  const handleConnect = () => {
    setIsConnected(true);

    // Send a request to start the connection on the server
    fetch("http://localhost:3001/startConnection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ streamerChannelName: streamer }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error connecting to server:", error);
      });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
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
            {msg.author}: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
