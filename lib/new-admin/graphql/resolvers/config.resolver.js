const { accounts: accountsConfig, countries, languages } = require('../../config')

// Debug accountsConfig
console.log('Account configs in resolver:', accountsConfig);
console.log('Zonda in accountsConfig:', accountsConfig.filter(a => a.code === 'zonda'));

const resolver = {
  Query: {
    countries: () => countries,
    languages: () => languages,
    accountsConfig: () => {
      console.log('Returning accountsConfig:', accountsConfig);
      // Upewniam się, że Zonda jest w danych
      const hasZonda = accountsConfig.some(a => a.code === 'zonda');
      console.log('Has Zonda?', hasZonda);
      
      return accountsConfig;
    }
  }
}

module.exports = resolver
