'use strict'

const { color } = require('../yeelight')

color('192.168.1.227', 0, 0, 0, (err) => {
  if (err) {
    console.error(`error [${err.message}] occured on 192.168.10.227`)
  } else {
    console.log('color 192.168.1.227 success')
  }
})
