require('./src/config/dotenv');

const { broker: brokerConfig } = require('./src/config/mqtt');

const mqtt = require('mqtt');

const broker = mqtt.connect(`mqtt://${brokerConfig.url}:${brokerConfig.port}`);

broker.on('connect', () => {

});

broker.publish('topic', '');

broker.subscribe('connect');

broker.on('message', (topic, payload) => {
  switch (topic) {
    case '':
      break;
  }
});