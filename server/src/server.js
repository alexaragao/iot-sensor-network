require('./config/dotenv');

const http = require('http');

// Express APP
const app = require('./app');

const server = http.createServer(app);

// Connect with MQTT Broker
require('./pubsub');

// Start WebSocket server
require('./websocket-server')(server);

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${server.address().port}`);
});