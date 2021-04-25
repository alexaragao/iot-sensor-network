require('./config/dotenv');

const http = require('http');

// Express APP
const app = require('./app');

const server = http.createServer(app);

// Connect with MQTT Broker and add to Express App
const mqtt = require('./services/mqtt');
app.set('mqtt', mqtt);

// Start WebSocket server
const wsserver = require('./services/websocket')(server);
app.set('wss', wsserver);

mqtt.set('wss', wsserver);
wsserver.set('mqtt', mqtt);

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${server.address().port}`);
});