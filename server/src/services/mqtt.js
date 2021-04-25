const { broker: brokerConfig } = require('../config/mqtt');
const mqtt = require('mqtt');

class MQTTPubSub {
  constructor() {
    this.broker = mqtt.connect(`mqtt://${brokerConfig.url}:${brokerConfig.port}`);
    this.assigns = {};

    this.broker.on('connect', () => {
      console.log('success');
    });

    this.broker.subscribe('sensors/status');
    this.broker.on('message', (topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());
        console.log(data);

        const wss = this.get('wss');
        if (wss) {
          console.log("sending...");
          wss.server.clients.forEach(client => {
            client.send(
              JSON.stringify({
                sensor: data.device_id,
                value: data.data,
                timestamp: process.uptime()
              })
            );
          });
        }
        switch (topic) {
          case '':
            break;
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  set(setting, value) {
    this.assigns[setting] = value;
  }

  get(setting) {
    return this.assigns[setting];
  }
}

module.exports = new MQTTPubSub();