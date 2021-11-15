'use strict'

const { Bulb } = require('../yeelight')
const l1 = new Bulb('192.168.1.217')

l1.on('props', () => {
  console.log(l1.props)
  l1.disconnect()
})

l1.on('connected', () => {
  l1.getProps()
})

l1.connect()
