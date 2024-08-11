// frontend/src/MessageBoard.js
import { useEffect, useState } from 'react';

export default function MessageBoard() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const newMessages = JSON.parse(event.data);
      setMessages(newMessages);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>Pesan Terbaru:</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg._id}>{msg.text} - {new Date(msg.receivedAt).toLocaleTimeString()}</li>
        ))}
      </ul>
    </div>
  );
}
