const { ticker } = require('./ccxt')

// W CCXT Zonda jest nadal dostępna pod nazwą "bitbay"
console.log('Inicjalizacja tickera Zonda (używając identyfikatora "bitbay" w CCXT)');
module.exports = { ticker: (...args) => ticker(...args, 'bitbay') } 