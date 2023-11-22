import React, { useState, useEffect } from "react";

function App() {
  // State variables
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [streamer, setStreamer] = useState("");
  const [prevStreamer, setPrevStreamer] = useState("");
  const [ws, setWs] = useState(null);

  // WebSocket connection useEffect
  useEffect(() => {
    let newWs;

    if (isConnected) {
      // Create a new WebSocket connection
      newWs = new WebSocket("ws://localhost:3001");

      // WebSocket event handlers
      newWs.onopen = () => {
        console.log("WebSocket connection opened");
      };

      newWs.onmessage = (event) => {
        // Handle incoming messages
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      };

      newWs.onclose = () => {
        // Handle WebSocket connection closure
        console.log("WebSocket connection closed");
        setIsConnected(false);
        setWs(null);
      };

      // Set the new WebSocket connection
      setWs(newWs);
    } else {
      // Close the WebSocket connection if disconnected
      if (ws) {
        ws.close();
      }
    }

    // Clean up the WebSocket connection on component unmount or dependency change
    return () => {
      if (newWs) {
        newWs.close();
      }
    };
  }, [isConnected, streamer]);

  // useEffect to handle disconnection and update prevStreamer
  useEffect(() => {
    if (prevStreamer && prevStreamer !== streamer && isConnected) {
      // Disconnect from the previous streamer if the streamer changes
      handleDisconnect(prevStreamer);
    }

    // Update prevStreamer
    setPrevStreamer(streamer);
  }, [streamer, prevStreamer, isConnected]);

  // Function to handle connection
  const handleConnect = async () => {
    try {
      // Make a POST request to start the WebSocket connection
      const response = await fetch("http://localhost:3001/startConnection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamerChannelName: streamer }),
      });

      if (response.ok) {
        // Set isConnected to true upon successful connection
        setIsConnected(true);
      } else {
        console.error("Failed to connect:", response.statusText);
      }
    } catch (error) {
      console.error("Error connecting:", error.message);
    }
  };

  // Function to handle disconnection
  const handleDisconnect = async (customStreamer = null) => {
    try {
      // Make a POST request to stop the WebSocket connection
      const response = await fetch("http://localhost:3001/stopConnection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          streamerChannelName: customStreamer || streamer,
        }),
      });

      if (response.ok) {
        // Set isConnected to false upon successful disconnection
        setIsConnected(false);
      } else {
        console.error("Failed to disconnect:", response.statusText);
      }
    } catch (error) {
      console.error("Error disconnecting:", error.message);
    }
  };

  // Function to clean messages
  const handleClean = () => {
    setMessages([]);
  };

  // JSX for the component
  return (
    <div className="App">
      {/* Input for entering the streamer name */}
      <label>
        Streamer:
        <input
          type="text"
          value={streamer}
          onChange={(e) => setStreamer(e.target.value)}
        />
      </label>

      {/* Connect/Disconnect and Clean buttons */}
      {isConnected ? (
        <button onClick={() => handleDisconnect()}>Disconnect</button>
      ) : (
        <button onClick={() => handleConnect()}>Connect</button>
      )}
      <button onClick={handleClean}>Clean</button>

      {/* Display messages in an unordered list */}
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
