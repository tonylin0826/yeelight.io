'use strict'

const { on } = require('../yeelight')

on('192.168.1.227', (err) => {
  if (err) {
    console.error(`error [${err.message}] occured on 192.168.10.227`)
  } else {
    console.log('on 192.168.1.227 success')
  }
})
