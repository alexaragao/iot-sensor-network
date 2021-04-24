const WebSocket = require('ws');

function startWebSocketServer(server) {
  const wsserver = new WebSocket.Server({ server });

  wsserver.on('connection', (ws) => {
    console.log('oi');
  });
}

module.exports = startWebSocketServer;