const ccxt = require('ccxt')

const BN = require('../../bn')
const { buildMarket, verifyFiatSupport } = require('../common/ccxt')
const { getRate } = require('../../../lib/forex')

const RETRIES = 2

const tickerObjects = {}

// Mapowanie nazw giełd - dla zachowania wstecznej kompatybilności
// Zonda mogła zmienić nazwę, ale w CCXT może być nadal jako BitBay
const EXCHANGE_NAME_MAP = {
  'zonda': ['zonda', 'bitbay'] // Sprawdź najpierw 'zonda', potem 'bitbay'
}

// This is probably fixed on upstream ccxt
// but we need to udpate node to get on the latest version
const sanityCheckRates = (ask, bid, tickerName) => {
  if (new BN(0).eq(ask) || new BN(0).eq(bid)) {
    throw new Error(`Failure fetching rates for ${tickerName}`)
  }
}

function ticker (fiatCode, cryptoCode, tickerName) {
  console.log(`Fetching ticker for ${cryptoCode}/${fiatCode} on ${tickerName}`)
  
  // Spróbuj znaleźć odpowiednią nazwę dla CCXT
  let exchangeId = tickerName;
  
  if (EXCHANGE_NAME_MAP[tickerName]) {
    // Jeśli mamy mapowanie dla tej giełdy, spróbuj użyć pierwszej dostępnej nazwy
    for (const nameOption of EXCHANGE_NAME_MAP[tickerName]) {
      if (typeof ccxt[nameOption] === 'function') {
        console.log(`Użycie alternatywnej nazwy dla ${tickerName}: ${nameOption}`);
        exchangeId = nameOption;
        break;
      }
    }
  }
  
  if (!tickerObjects[exchangeId]) {
    console.log(`Creating new ticker instance for ${exchangeId}`);
    try {
      tickerObjects[exchangeId] = new ccxt[exchangeId]({
        timeout: 3000,
        enableRateLimit: false,
      });
      console.log(`Successfully created ticker for ${exchangeId}`);
    } catch (error) {
      console.error(`Error creating ticker for ${exchangeId}:`, error);
      throw error;
    }
  }

  const ticker = tickerObjects[exchangeId]

  if (verifyFiatSupport(fiatCode, tickerName)) {
    return getCurrencyRates(ticker, fiatCode, cryptoCode)
  }

  return getRate(RETRIES, fiatCode)
    .then(({ fxRate }) => {
      try {
        return getCurrencyRates(ticker, 'USD', cryptoCode)
          .then(res => ({
            rates: {
              ask: res.rates.ask.times(fxRate),
              bid: res.rates.bid.times(fxRate)
            }
          }))
      } catch (e) {
        return Promise.reject(e)
      }
    })
}

function getCurrencyRates (ticker, fiatCode, cryptoCode) {
  try {
    if (!ticker.has['fetchTicker']) {
      throw new Error('Ticker not available')
    }
    
    console.log(`Getting symbol for ${fiatCode}, ${cryptoCode}, ${ticker.id}`);
    const symbol = buildMarket(fiatCode, cryptoCode, ticker.id)
    console.log(`Fetching ticker for symbol: ${symbol}`);
    
    return ticker.fetchTicker(symbol)
      .then(res => {
        console.log(`Got ticker result for ${symbol}:`, res);
        sanityCheckRates(res.ask, res.bid, cryptoCode)
        return {
          rates: {
            ask: new BN(res.ask),
            bid: new BN(res.bid)
          }
        }
    })
  } catch (e) {
    console.error(`Error getting currency rates:`, e);
    return Promise.reject(e)
  }
}

module.exports = { ticker }
