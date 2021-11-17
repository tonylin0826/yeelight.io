'use strict'

const net = require('net')
const { EventEmitter } = require('events')

class Bulb extends EventEmitter {
  constructor(ip, port) {
    super()

    this.ip = ip
    this.port = port || 55443
    this._connected = false

    this._supportedProps = [
      'power',
      'bright',
      'ct',
      'rgb',
      'hue',
      'sat',
      'color_mode',
      'flowing',
      'delayoff',
      'flow_params',
      'music_on',
      'name',
      'bg_power',
      'bg_flowing',
      'bg_flow_params',
      'bg_ct',
      'bg_lmode',
      'bg_bright',
      'bg_rgb',
      'bg_hue',
      'bg_sat',
      'nl_br'
    ]
  }

  connect() {
    this.client = new net.Socket()
    this.cmdId = 0

    this.props = {}

    this.messageHandler = {
      props: this.onProps.bind(this)
    }

    this.waitingRequest = new Map()

    this.client.connect(this.port, this.ip, this._onConnected.bind(this))

    this.client.on('data', (data) => {
      const messages = data
        .toString()
        .split('\r\n')
        .filter((m) => m !== '')

      for (const message of messages) {
        this._onData(message)
      }
    })
    this.client.on('close', this._onClose.bind(this))
    this.client.on('error', this._onError.bind(this))
  }

  disconnect() {
    this.client.end()
  }

  get connected() {
    return this._connected
  }

  _onData(message) {
    try {
      const r = JSON.parse(message)

      if (r && r.method && this.messageHandler[r.method]) {
        this.messageHandler[r.method](r.params)
        this.emit('props', this)
        return
      }

      this.emit('data', this, r)

      const { result: results, error } = r

      if (Number.isInteger(r.id)) {
        const request = this.waitingRequest.get(r.id)
        this.waitingRequest.delete(r.id)

        if (error) {
          this._onError(new Error(error.message))
          return
        } 
        
        if (request && request.method === 'get_prop') {
          const propsObj = this._supportedProps.reduce((prev, cur, idx) => {
            prev[cur] = results[idx]
            return prev
          }, {})

          this.messageHandler.props(propsObj)
          this.emit('props', this)
          return
        }
      }

    } catch (e) {
      this._onError(e)
    }
  }

  _onConnected() {
    // console.log('_onConnected');
    this._connected = true
    this.emit('connected', this)
  }

  _onError(err) {
    // console.log(`_onError, ${err}`);

    this.emit('error', this, err)
  }

  _onClose() {
    // console.log('_onClose');
    this._connected = false
    this.emit('disconnected', this)
  }

  onProps(prop) {
    // console.log('onProps', prop);
    for (const p in prop) {
      if (p in prop) {
        this.props[p] = prop[p]
      }
    }
  }

  toggle() {
    this.sendCmd({
      params: ['smooth', 300],
      method: 'toggle'
    })
  }

  off() {
    this.sendCmd({
      params: ['off', 'smooth', 300],
      method: 'set_power'
    })
  }

  onn() {
    this.sendCmd({
      params: ['on', 'smooth', 300],
      method: 'set_power'
    })
  }

  brightness(value) {
    this.sendCmd({
      params: [value, 'smooth', 300],
      method: 'set_bright'
    })
  }

  color(r, g, b) {
    this.sendCmd({
      params: [r * 65536 + g * 256 + b, 'smooth', 300],
      method: 'set_rgb'
    })
  }

  getProps() {
    this.sendCmd({
      method: 'get_prop',
      params: [
        'power',
        'bright',
        'ct',
        'rgb',
        'hue',
        'sat',
        'color_mode',
        'flowing',
        'delayoff',
        'flow_params',
        'music_on',
        'name',
        'bg_power',
        'bg_flowing',
        'bg_flow_params',
        'bg_ct',
        'bg_lmode',
        'bg_bright',
        'bg_rgb',
        'bg_hue',
        'bg_sat',
        'nl_br'
      ]
    })
  }

  sendCmd(cmd) {
    if (!this.connected) {
      throw new Error(
        'Blub is not connected - please send command after connected'
      )
    }

    cmd.id = this.cmdId++
    this.waitingRequest.set(cmd.id, cmd)
    this.client.write(`${JSON.stringify(cmd)}\r\n`)
  }

  status() {
    return this.props
  }
}

const base = (l1, cb, toBeCalled) => {
  l1.on('connected', () => {
    toBeCalled()
  })

  l1.on('data', (light, d) => {
    light.disconnect()

    let err = new Error(`light ${light.ip} returns not ok`)
    if (
      Array.isArray(d.result) &&
      d.result.length === 1 &&
      d.result[0] === 'ok'
    ) {
      err = null
    }

    if (cb) {
      cb(err)
    }
  })

  l1.on('error', (light, err) => {
    light.disconnect()

    if (cb) {
      cb(err)
    }
  })

  l1.connect()
}

module.exports = {
  Bulb,
  toggle: (ip, cb) => {
    const l1 = new Bulb(ip)
    base(l1, cb, l1.toggle.bind(l1))
  },
  on: (ip, cb) => {
    const l1 = new Bulb(ip)
    base(l1, cb, l1.onn.bind(l1))
  },
  off: (ip, cb) => {
    const l1 = new Bulb(ip)
    base(l1, cb, l1.off.bind(l1))
  },
  brightness: (ip, level, cb) => {
    const l1 = new Bulb(ip)
    base(l1, cb, l1.brightness.bind(l1, level))
  },
  color: (ip, r, g, b, cb) => {
    const l1 = new Bulb(ip)
    base(l1, cb, l1.color.bind(l1, r, g, b))
  }
}
