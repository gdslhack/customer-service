// websocket-server.js
const WebSocket = require('ws');
const { MongoClient } = require('mongodb');

const wss = new WebSocket.Server({ port: 8080 });
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

wss.on('connection', (ws) => {
  console.log('Client connected');

  const sendMessages = async () => {
    try {
      await client.connect();
      const db = client.db('your_database');
      const collection = db.collection('messages');
      const messages = await collection.find({}).toArray();
      ws.send(JSON.stringify(messages));
    } finally {
      await client.close();
    }
  };

  sendMessages();

  const handleMessageFromTelegram = async (message) => {
    try {
      await client.connect();
      const db = client.db('your_database');
      const collection = db.collection('messages');
      await collection.insertOne({
        chatId: message.chat.id,
        text: message.text,
        receivedAt: new Date(),
      });

      const messages = await collection.find({}).toArray();
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messages));
        }
      });
    } finally {
      await client.close();
    }
  };

  setInterval(() => {
    handleMessageFromTelegram({
      chat: { id: 1 },
      text: `Pesan baru pada ${new Date().toLocaleTimeString()}`,
    });
  }, 10000);
});

console.log('WebSocket server running on ws://localhost:8080');
