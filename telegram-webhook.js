// telegram-webhook.js
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());

const ws = new WebSocket('ws://localhost:8080');

app.post('/telegram-webhook', async (req, res) => {
  const message = req.body.message;

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      chatId: message.chat.id,
      text: message.text,
      receivedAt: new Date(),
    }));
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Telegram webhook server running on http://localhost:3000');
});
