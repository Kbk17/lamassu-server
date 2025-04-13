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

// Dodatkowe logi dla lepszego debugowania
console.log('Ładowanie modułu Zonda...');

// Sprawdzamy czy ccxt faktycznie wspiera Zondę
try {
  const ccxt = require('ccxt');
  console.log('Dostępne giełdy w CCXT z nazwą podobną do Zonda:', Object.keys(ccxt).filter(e => e.toLowerCase().includes('zonda') || e.toLowerCase().includes('bitbay')));
  
  // Bardzo ważna informacja - sprawdzamy dokładnie nazwę exchange w CCXT
  // Jeśli Zonda jest dostępna pod inną nazwą (np. 'zondaX' albo nadal jako 'bitbay')
  // to musimy zmienić to również w innych plikach
  if (Object.keys(ccxt).includes('zonda')) {
    console.log('CCXT wspiera Zondę jako "zonda"');
  } else if (Object.keys(ccxt).includes('bitbay')) {
    console.log('CCXT wspiera Zondę pod starą nazwą "bitbay"');
  } else {
    console.error('CCXT nie wspiera Zondy pod żadną znaną nazwą!');
  }
} catch (error) {
  console.error('Błąd podczas sprawdzania wsparcia CCXT dla Zondy:', error);
}

const loadConfig = (account) => {
  console.log('Ładowanie konfiguracji Zonda z konta:', account);
  
  try {
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
  } catch (error) {
    console.error('Błąd podczas ładowania konfiguracji Zonda:', error);
    throw error;
  }
}

const loadOptions = () => ({ expiretm: '+60' })

module.exports = { 
  USER_REF, 
  loadOptions, 
  loadConfig, 
  REQUIRED_CONFIG_FIELDS, 
  CRYPTO, 
  FIAT, 
  ORDER_TYPE, 
  AMOUNT_PRECISION
} 