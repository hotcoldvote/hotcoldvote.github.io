const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let sharedArray = ["initial", "data"]; // Your shared array

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', ws => {
  // Send current array on new connection
  ws.send(JSON.stringify({ type: 'array_update', data: sharedArray }));

  ws.on('message', message => {
    const parsed = JSON.parse(message);

    if (parsed.type === 'update_array') {
      sharedArray = parsed.data;

      // Broadcast the new array to all clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'array_update', data: sharedArray }));
        }
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
