'use strict';

const net = require('net');
const { EventEmitter } = require('events');

class Bulb extends EventEmitter {
  constructor(ip, port) {
    super();

    this.ip = ip;
    this.port = port || 55443;

    this.client = new net.Socket();
    this.cmdId = 0;

    this.props = {};

    this.messageHandler = {
      props: this.onProps.bind(this)
    };

    this.client.connect(this.port, this.ip, () => {
      console.log('connected');
      this.emit('connected');
    });

    this.client.on('data', (data) => {

      try {
        const r = JSON.parse(data.toString());
        // console.log(r, this.messageHandler, this.messageHandler[r.method], r.method);
        if (r && r.method && this.messageHandler[r.method]) {
          this.messageHandler[r.method](r.params);
        }
      } catch (e) {
        this.emit('error', e);
      }
    });

    this.client.on('close', () => {
      this.emit('close');
    });
  }

  onProps(prop) {
    // console.log('onProps', prop);
    for (const p in prop) {
      if (p in prop) {
        this.props[p] = prop[p];
      }
    }
  }

  toggle() {
    this.sendCmd({
      params: ['smooth', 300],
      id: this.cmdId++,
      method: 'toggle'
    });
  }

  off() {
    this.sendCmd({
      params: ['off', 'smooth', 300],
      id: this.cmdId++,
      method: 'set_power'
    });
  }

  on() {
    this.sendCmd({
      params: ['on', 'smooth', 300],
      id: this.cmdId++,
      method: 'set_power'
    });
  }

  brightness(value) {
    this.sendCmd({
      params: [value, 'smooth', 300],
      id: this.cmdId++,
      method: 'set_bright'
    });
  }

  color(r, g, b) {
    this.sendCmd({
      params: [r * 65536 + g * 256 + b, 'smooth', 300],
      id: this.cmdId++,
      method: 'set_rgb'
    });
  }

  sendCmd(cmd) {
    this.client.write(`${JSON.stringify(cmd)}\r\n`);
  }

  status() {
    return this.props;
  }
}

module.exports = Bulb;