// frontend/src/MessageBoard.js
import { useEffect, useState } from 'react';

export default function MessageBoard() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
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
