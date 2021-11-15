# yeelight.io
[![NPM version](https://img.shields.io/npm/v/yeelight.io.svg?style=flat)](https://www.npmjs.com/package/yeelight.io)
[![NPM downloads](https://img.shields.io/npm/dm/yeelight.io.svg?style=flat)](https://www.npmjs.com/package/yeelight.io)

# Description
`yeelight.io` is a simple library for you to control YeeLight LED bulb through LAN.

## Installation
```
npm install yeelight.io
```

## Usage

Using Bulb type
```javascript
'use strict';

const { Bulb } = require('yeelight.io');

const l1 = new Bulb('192.168.1.227');

l1.on('connected', (light) => {
  console.log(`connected to ${light.ip}`);
  light.toggle();
  light.disconnect();
});

l1.on('disconnected', (light) => {
  console.log(`disconnected with ${light.ip}`);
});

l1.on('error', (light, err) => {
  console.error(`error [${err.message}] occur on ${light.ip}`);
  light.disconnect();

});

l1.connect();
```

Using pre-implement methods
```javascript
'use strict';

const { toggle } = require('yeelight.io');

toggle('192.168.1.227', (err) => {
  if (err) {
    console.error(`error [${err.message}] occured on 192.168.10.227`);
  } else {
    console.log('toggle 192.168.1.227 success');
  }
});
```

## API
- <a href="#constructor"><code><b>Bulb(ip, [port])</b></code></a>
- <a href="#on"><code><b>on(ip, [cb(err)])</b></code></a>
- <a href="#off"><code><b>off(ip, [cb(err)])</b></code></a>
- <a href="#brightness"><code><b>brightness(ip, [cb(err)])</b></code></a>
- <a href="#color"><code><b>color(ip, [cb(err)]</b></code></a>

-------------------------------------------------------
<a name="constructor"></a>
### Bulb(ip, [port])
Create a new Bulb object

Properties:
  - <a href="#pconnected"><code><b>connected</b></code></a>

Methods:
  - <a href="#iconnect"><code><b>connect()</b></code></a>
  - <a href="#itoggle"><code><b>toggle()</b></code></a>
  - <a href="#ionn"><code><b>onn()</b></code></a>
  - <a href="#ioff"><code><b>off()</b></code></a>
  - <a href="#ibrightness"><code><b>brightness(level)</b></code></a>
  - <a href="#icolor"><code><b>color(r, g, b)</b></code></a>
  - <a href="#iprop"><code><b>getProps()</b></code></a>


Events:
  - <a href="#econnected"><code><b>Event: 'connected'</b></code></a>
  - <a href="#edisconnected"><code><b>Event: 'disconnected'</b></code></a>
  - <a href="#eerror"><code><b>Event: 'error'</b></code></a>
  - <a href="#edata"><code><b>Event: 'data'</b></code></a>

-------------------------------------------------------
<a name="pconnected"></a>
### instance.connected
Yeelight bulb connection state

```javascript
const l1 = new Bulb(IP_STR);

if (l1.connected) {
  l1.toggle()
}
```

-------------------------------------------------------
<a name="iconnect"></a>
### instance.connect()
Start connecting to Yeelight bulb

```javascript
const l1 = new Bulb(IP_STR);

l1.connect();
```

-------------------------------------------------------
<a name="itoggle"></a>
#### Instance.toggle()
Toggle a Yeelight bulb

```javascript
const l1 = new Bulb(IP_STR);

...

l1.toggle();
```

-------------------------------------------------------
<a name="ionn"></a>
#### Instance.onn()
Turn on a Yeelight bulb. **NOTE**: `onn` on purpose to avoid same name with event `on`

```javascript
const l1 = new Bulb(IP_STR);

...

l1.onn();
```

-------------------------------------------------------
<a name="ioff"></a>
#### Instance.off()
Turn off a Yeelight bulb

```javascript
const l1 = new Bulb(IP_STR);

...

l1.off();
```

-------------------------------------------------------
<a name="ibrightness"></a>
#### Instance.brightness(level)
Change brightness of a Yeelight bulb

```javascript
const l1 = new Bulb(IP_STR);

...

l1.brightness(50); // Turn brightness to half
```

-------------------------------------------------------
<a name="icolor"></a>
#### Instance.color(r, g, b)
Change color of a Yeelight bulb

```javascript
const l1 = new Bulb(IP_STR);

...

l1.color(255, 0, 0); // Turn bulb to red
```

-------------------------------------------------------
<a name="iprop"></a>
#### Instance.getProps()
Retrieve properties from a Yeelight bulb, current support properties
- power
- bright
- ct
- rgb
- hue
- sat
- color_mode
- flowing
- delayoff
- flow_params
- music_on
- name
- bg_power
- bg_flowing
- bg_flow_params
- bg_ct
- bg_lmode
- bg_bright
- bg_rgb
- bg_hue
- bg_sat
- nl_b

```javascript
const l1 = new Bulb(IP_STR);

...

l1.on('props', () => {
  console.log(l1.props)
  // {
  //    power: 'on',
  //    bright: '50',
  //    ct: '4357',
  //    rgb: '16711680',
  //    hue: '0',
  //    sat: '100',
  //    color_mode: '2',
  //    flowing: '0',
  //    delayoff: '0',
  //    flow_params: '0,0,1000,1,16776960,100,1000,1,65280,100,1000,1,16744192,100,1000,1,255,100',
  //    music_on: '0',
  //    name: '',
  //    bg_power: '',
  //    bg_flowing: '',
  //    bg_flow_params: '',
  //    bg_ct: '',
  //    bg_lmode: '',
  //    bg_bright: '',
  //    bg_rgb: '',
  //    bg_hue: '',
  //    bg_sat: '',
  //    nl_br: ''
  //  }
}
})

l1.getProps(); // Get bulb properties
```

-------------------------------------------------------
<a name="econnected"></a>
#### Event: 'connected'
Emit when connected with Yeelight bulb

- `light` `<Bulb>` bulb that is connected


-------------------------------------------------------
<a name="edisconnected"></a>
#### Event: 'disconnected'
Emit when disconnected with Yeelight bulb

- `light` `<Bulb>` bulb that is disconnected

-------------------------------------------------------
<a name="eerror"></a>
#### Event: 'error'
Emit when any kind of error occured

- `light` `<Bulb>`
- `err` `<Error>`

-------------------------------------------------------
<a name="edata"></a>
#### Event: 'data'
Emit when Yeelight bulb sends response

- `light` `<Bulb>`
- `data` `<object>`

-------------------------------------------------------
<a name="toggle"></a>
### toggle(ip, [cb(err)])
Toggle a Yeelight bulb

- `ip` `<string>` eelight bulb IP address
- `cb(err)` `<Function>` called after toggle command is sent to the bulb, `err` `<Error>` not null if error occured

-------------------------------------------------------
<a name="on"></a>
### on(ip, [cb(err)])
Turn on a Yeelight bulb

- `ip` `<string>` eelight bulb IP address
- `cb(err)` `<Function>` called after toggle command is sent to the bulb, `err` `<Error>` not null if error occured

-------------------------------------------------------
<a name="off"></a>
### off(ip, [cb(err)])
Turn off a Yeelight bulb

- `ip` `<string>` eelight bulb IP address
- `cb(err)` `<Function>` called after toggle command is sent to the bulb, `err` `<Error>` not null if error occured

-------------------------------------------------------
<a name="brightness"></a>
### brightness(ip, level, [cb(err)])
Change brightness of a Yeelight bulb

- `ip` `<string>` eelight bulb IP address
- `level` `<number>` brightness level, 0 ~ 255
- `cb(err)` `<Function>` called after toggle command is sent to the bulb, `err` `<Error>` not null if error occured

-------------------------------------------------------
<a name="color"></a>
### color(ip, r, g, b[cb(err)])
Change color of a Yeelight bulb

- `ip` `<string>` eelight bulb IP address
- `r` `<number>` red of RGB, 0 ~ 255
- `g` `<number>` green of RGB, 0 ~ 255
- `b` `<number>` blue of RGB, 0 ~ 255
- `cb(err)` `<Function>` called after toggle command is sent to the bulb, `err` `<Error>` not null if error occured


## License
MIT

