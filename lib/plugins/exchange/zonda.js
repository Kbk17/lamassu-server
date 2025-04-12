const _ = require('lodash/fp')

const { ORDER_TYPES } = require('./consts')
const { COINS } = require('@lamassu/coins')

const ORDER_TYPE = ORDER_TYPES.MARKET
const { BTC, ETH, USDT } = COINS
const CRYPTO = [BTC, ETH, USDT]
const FIAT = ['PLN']
const AMOUNT_PRECISION = 8
const REQUIRED_CONFIG_FIELDS = ['apiKey', 'privateKey']
const USER_REF = 'client_order_id' // Identyfikator transakcji dla Zondy

const loadConfig = (account) => {
  const mapper = {
    'privateKey': 'secret'
  }
  const mapped = _.mapKeys(key => mapper[key] ? mapper[key] : key)(account)

  return {
    ...mapped,
    timeout: 3000,
    nonce: function () { return this.microseconds() },
    enableRateLimit: true,
    options: {
      createMarketBuyOrderRequiresPrice: false
    }
  }
}

const loadOptions = () => ({ expiretm: '+60' })

const buildMarket = (fiatCode, cryptoCode) => {
  return `${cryptoCode}-${fiatCode}`
}

module.exports = { 
  USER_REF, 
  loadOptions, 
  loadConfig, 
  REQUIRED_CONFIG_FIELDS, 
  CRYPTO, 
  FIAT, 
  ORDER_TYPE, 
  AMOUNT_PRECISION,
  buildMarket
} 