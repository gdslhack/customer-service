// api/messages.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const db = client.db('your_database');
      const collection = db.collection('messages');
      const messages = await collection.find({}).toArray();
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    } finally {
      await client.close();
    }
  } else if (req.method === 'POST') {
    try {
      const message = req.body;
      await client.connect();
      const db = client.db('your_database');
      const collection = db.collection('messages');
      await collection.insertOne({
        chatId: message.chatId,
        text: message.text,
        receivedAt: new Date(),
      });
      res.status(200).json({ message: 'Message saved' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save message' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
