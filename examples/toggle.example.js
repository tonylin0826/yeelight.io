'use strict'

const { toggle } = require('../yeelight')

toggle('192.168.1.217', (err) => {
  if (err) {
    console.error(`error [${err.message}] occured on 192.168.10.160`)
  } else {
    console.log('toggle 192.168.1.160 success')
  }
})
