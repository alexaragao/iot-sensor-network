const WebSocket = require('ws');

class WebSocketServer {
  constructor (server) {
    this.sever = new WebSocket.Server({ server });
    this.assigns = {};
  }

  set(setting, value) {
    this.assigns[setting] = value;
  }

  get(setting) {
    return this.assigns[setting];
  }
}

module.exports = (server) => new WebSocketServer(server);