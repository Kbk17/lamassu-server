const { ticker } = require('./ccxt')

module.exports = { ticker: (...args) => ticker(...args, 'zonda') } 