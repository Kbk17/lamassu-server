// lib/plugins/exchange/zonda.js
const _ = require('lodash/fp')

const { ORDER_TYPES } = require('./consts')
const { COINS } = require('@lamassu/coins')

// Konfiguracja podstawowa
const ORDER_TYPE = ORDER_TYPES.MARKET
const { BTC, ETH, LTC, USDT, USDC } = COINS

// Obsługiwane waluty
const CRYPTO = [BTC, ETH, LTC, USDT, USDC]
const FIAT = ['PLN', 'EUR', 'USD']
const DEFAULT_FIAT_MARKET = 'PLN'
const AMOUNT_PRECISION = 8
const USER_REF = 'userref'

// Wymagane pola konfiguracyjne
const REQUIRED_CONFIG_FIELDS = ['apiKey', 'secret', 'currencyMarket']

// Mapowanie pól konfiguracyjnych
const loadConfig = (account) => {
  const mapper = {
    'privateKey': 'secret'
  }
  const mapped = _.mapKeys(key => mapper[key] ? mapper[key] : key)(account)

  return {
    ...mapped,
    timeout: 3000,
    enableRateLimit: true,
    nonce: function () { return this.microseconds() },
    headers: {
      'Content-Type': 'application/json',
      'API-Key': mapped.apiKey,
      'API-Hash': mapped.secret
    }
  }
}

// Opcje dla zleceń
const loadOptions = () => ({ expiretm: '+60' })

module.exports = {
  loadConfig,
  loadOptions,
  DEFAULT_FIAT_MARKET,
  REQUIRED_CONFIG_FIELDS,
  CRYPTO,
  FIAT,
  ORDER_TYPE,
  AMOUNT_PRECISION,
  USER_REF
}