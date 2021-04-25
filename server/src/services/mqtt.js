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
        console.log(payload.toString());
        const data = JSON.parse(payload.toString());
        console.log(data);

        const wss = this.get('wss');
        if (wss && wss.clients) {
          wss.clients.forEach(client => {
            client.send(
              JSON.stringify({
                sensor: data.sensor_id,
                value: data.value_raw,
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