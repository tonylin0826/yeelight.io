# Description
`yeelight` is a simple library for you to control YeeLight LED bulb through LAN.

## Installation
```
npm install yeelight
```

## Usage
```javascript
'use strict';

const Bulb = require('yeelight');
const l1 = new Bulb('192.168.10.25');

l1.on('connected', () => {
  l1.toggle();
  l1.on();
  l1.off();
  l1.color(255, 0, 0);
});
```
## License
MIT

