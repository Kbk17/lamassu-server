import * as R from 'ramda'

import schema from 'src/pages/Services/schemas'
const contains = crypto => R.compose(R.contains(crypto), R.prop('cryptos'))
const sameClass = type => R.propEq('class', type)
const filterConfig = (crypto, type) =>
  R.filter(it => sameClass(type)(it) && contains(crypto)(it))
export const getItems = (accountsConfig, accounts, type, crypto) => {
  console.log(`getItems dla ${type} i kryptowaluty ${crypto}`);
  console.log("accountsConfig:", accountsConfig);
  console.log("Szukam Zondy w accountsConfig:", accountsConfig.filter(a => a.code === 'zonda'));
  
  // Dodaj Zondę, jeśli szukamy giełdy a jej nie ma w konfiguracji
  if (type === 'exchange' && !accountsConfig.some(a => a.code === 'zonda')) {
    console.log(`Dodaję Zondę do accountsConfig, ponieważ nie jest tam obecna`);
    accountsConfig.push({
      code: 'zonda',
      display: 'Zonda',
      class: 'exchange',
      cryptos: [crypto]
    });
  }
  
  // Upewnijmy się, że Zonda jest dostępna dla każdej kryptowaluty
  const zondaConfigIdx = accountsConfig.findIndex(a => a.code === 'zonda' && a.class === type);
  if (zondaConfigIdx !== -1) {
    // Upewnij się, że Zonda obsługuje bieżącą kryptowalutę
    if (!accountsConfig[zondaConfigIdx].cryptos.includes(crypto)) {
      console.log(`Dodaję ${crypto} do obsługiwanych walut dla Zondy`);
      accountsConfig[zondaConfigIdx] = {
        ...accountsConfig[zondaConfigIdx],
        cryptos: [...accountsConfig[zondaConfigIdx].cryptos, crypto]
      };
    }
  } else {
    console.log(`Zonda nie znaleziona dla typu ${type}. To może być problem.`);
  }
  
  const fConfig = filterConfig(crypto, type)(accountsConfig)
  console.log(`Przefiltrowane konfiguracje dla ${crypto} i ${type}:`, fConfig);
  console.log(`Czy Zonda jest w przefiltrowanych konfiguracjach:`, fConfig.some(it => it.code === 'zonda'));
  
  const find = code => accounts && accounts[code]

  const [filled, unfilled] = R.partition(({ code }) => {
    const account = find(code)
    if (!schema[code]) return true

    const { getValidationSchema } = schema[code]
    return getValidationSchema(account).isValidSync(account)
  })(fConfig)
  
  console.log("Wypełnione (filled):", filled);
  console.log("Niewypełnione (unfilled):", unfilled);
  console.log("Zonda w wypełnionych:", filled.some(it => it.code === 'zonda'));
  console.log("Zonda w niewypełnionych:", unfilled.some(it => it.code === 'zonda'));

  return { filled, unfilled }
}
