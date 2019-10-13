'use strict';

const net = require('net');
const { EventEmitter } = require('events');

class Bulb extends EventEmitter {
  constructor(ip, port) {
    super();

    this.ip = ip;
    this.port = port || 55443;
  }

  connect() {
    this.client = new net.Socket();
    this.cmdId = 0;

    this.props = {};

    this.messageHandler = {
      props: this.onProps.bind(this)
    };

    this.waitingRequest = new Map();

    this.client.connect(this.port, this.ip, this._onConnected.bind(this));

    this.client.on('data', this._onData.bind(this));
    this.client.on('close', this._onClose.bind(this));
    this.client.on('error', this._onError.bind(this));
  }

  disconnect() {
    this.client.end();
  }

  _onData(data) {
    try {
      const r = JSON.parse(data.toString());
      if (r && r.method && this.messageHandler[r.method]) {
        this.messageHandler[r.method](r.params);
        this.emit('props', this);
      } else {
        if (
          Number.isInteger(r.id) &&
          Array.isArray(r.result) &&
          r.result.length === 1
        ) {
          const [re] = r.result;

          const request = this.waitingRequest.get(r.id);
          this.waitingRequest.delete(r.id);

          if (re !== 'ok') {
            // console.log('retry', request);
            setTimeout(this.sendCmd.bind(this, request), 500);
          }
        }
        this.emit('data', this, r);
      }
    } catch (e) {
      this._onError(e);
    }
  }

  _onConnected() {
    // console.log('_onConnected');

    this.emit('connected', this);
  }

  _onError(err) {
    // console.log(`_onError, ${err}`);

    this.emit('error', this, err);
  }

  _onClose() {
    // console.log('_onClose');

    this.emit('disconnected', this);
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
      method: 'toggle'
    });
  }

  off() {
    this.sendCmd({
      params: ['off', 'smooth', 300],
      method: 'set_power'
    });
  }

  onn() {
    this.sendCmd({
      params: ['on', 'smooth', 300],
      method: 'set_power'
    });
  }

  brightness(value) {
    this.sendCmd({
      params: [value, 'smooth', 300],
      method: 'set_bright'
    });
  }

  color(r, g, b) {
    this.sendCmd({
      params: [r * 65536 + g * 256 + b, 'smooth', 300],
      method: 'set_rgb'
    });
  }

  sendCmd(cmd) {
    cmd.id = this.cmdId++;
    this.waitingRequest.set(cmd.id, cmd);
    this.client.write(`${JSON.stringify(cmd)}\r\n`);
  }

  status() {
    return this.props;
  }
}

const base = (l1, cb, toBeCalled) => {
  l1.on('connected', () => {
    toBeCalled();
  });

  l1.on('data', (light, d) => {
    light.disconnect();

    let err = new Error(`light ${light.ip} returns not ok`);
    if (
      Array.isArray(d.result) &&
      d.result.length === 1 &&
      d.result[0] === 'ok'
    ) {
      err = null;
    }

    if (cb) {
      cb(err);
    }
  });

  l1.on('error', (light, err) => {
    light.disconnect();

    if (cb) {
      cb(err);
    }
  });

  l1.connect();
};

module.exports = {
  Bulb,
  toggle: (ip, cb) => {
    const l1 = new Bulb(ip);
    base(l1, cb, l1.toggle.bind(l1));
  },
  on: (ip, cb) => {
    const l1 = new Bulb(ip);
    base(l1, cb, l1.onn.bind(l1));
  },
  off: (ip, cb) => {
    const l1 = new Bulb(ip);
    base(l1, cb, l1.off.bind(l1));
  },
  brightness: (ip, level, cb) => {
    const l1 = new Bulb(ip);
    base(l1, cb, l1.brightness.bind(l1, level));
  },
  color: (ip, r, g, b, cb) => {
    const l1 = new Bulb(ip);
    base(l1, cb, l1.color.bind(l1, r, g, b));
  }
};