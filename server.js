const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let sharedArray = [
  [1, 1000], [2, 1000], [3, 1000],
  [4, 1000], [5, 1000], [6, 1000],
  [7, 1000], [8, 1000], [9, 1000]
];

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', ws => {
  // Optionally send array immediately on connect
  ws.send(JSON.stringify({ type: 'array_update', data: sharedArray }));

  ws.on('message', message => {
    const parsed = JSON.parse(message);

    if (parsed.type === 'request_array') {
      ws.send(JSON.stringify({ type: 'array_update', data: sharedArray }));
    }

    if (parsed.type === 'update_array') {
      sharedArray = parsed.data;

      // Broadcast updated array to all connected clients
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
