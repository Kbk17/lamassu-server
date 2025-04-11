# Lamassu Server - Kompleksowy Przewodnik

## 1. Opis Projektu
Lamassu Server to główny komponent serwerowy platformy Lamassu, która jest systemem do obsługi kryptomatów (bankomatów kryptowalutowych). Serwer obsługuje komunikację między urządzeniami Lamassu a systemem administracyjnym.

## 2. Architektura Systemu
- **Backend**: Node.js (wymagana wersja 8.3 lub wyższa)
- **Baza danych**: PostgreSQL
- **API**: GraphQL
- **Bezpieczeństwo**: Certyfikaty SSL/TLS, autentykacja dwuskładnikowa

## 3. Główne Komponenty
- **lamassu-server**: Główny serwer aplikacji
- **lamassu-admin**: Panel administracyjny
- **lamassu-migrate**: Narzędzie do migracji bazy danych
- **lamassu-register**: Narzędzie do rejestracji użytkowników

## 4. Wymagania Systemowe
### Ubuntu 16.04
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib postgresql-server-dev-9.5 libpq-dev git
```

### MacOS
- Postgres.app
- Node.js (instalacja przez n-install)

## 5. Konfiguracja Środowiska
### Zmienne Środowiskowe (.env)
- **Baza danych**:
  - POSTGRES_USER
  - POSTGRES_PASSWORD
  - POSTGRES_HOST
  - POSTGRES_PORT
  - POSTGRES_DB

- **Certyfikaty**:
  - CA_PATH
  - CERT_PATH
  - KEY_PATH

- **Ścieżki**:
  - MNEMONIC_PATH
  - BLOCKCHAIN_DIR
  - OFAC_DATA_DIR
  - ID_PHOTO_CARD_DIR
  - FRONT_CAMERA_DIR
  - OPERATOR_DATA_DIR

- **Węzły kryptowalut**:
  - BTC_NODE_LOCATION
  - BTC_WALLET_LOCATION
  - BTC_NODE_HOST
  - BTC_NODE_PORT
  - BTC_NODE_RPC_HOST
  - BTC_NODE_RPC_PORT
  - BTC_NODE_USER
  - BTC_NODE_PASSWORD

## 6. Instalacja i Uruchomienie
1. Instalacja zależności:
```bash
npm install
```

2. Generowanie certyfikatów:
```bash
bash tools/cert-gen.sh
```

3. Konfiguracja bazy danych:
```bash
node bin/lamassu-migrate
```

4. Uruchomienie panelu administracyjnego:
```bash
cd new-lamassu-admin/
npm install
npm run start
```

5. Uruchomienie serwera administracyjnego:
```bash
node bin/lamassu-admin-server --dev
```

6. Rejestracja użytkownika administracyjnego:
```bash
node bin/lamassu-register admin@example.com superuser
```

## 7. Obsługiwane Kryptowaluty
- Bitcoin (BTC)
- Bitcoin Cash (BCH)
- Dash (DASH)
- Litecoin (LTC)
- Zcash (ZEC)
- Ethereum (ETH)
- Tron (TRX)

## 8. Bezpieczeństwo
- Autentykacja dwuskładnikowa
- Szyfrowanie danych
- Certyfikaty SSL/TLS
- Bezpieczne przechowywanie kluczy prywatnych

## 9. Integracje
### 9.1 Giełdy Kryptowalutowe
System Lamassu integruje się z wieloma giełdami kryptowalutowymi poprzez bibliotekę CCXT (CryptoCurrency eXchange Trading Library).

#### Obsługiwane Giełdy
- Binance
- Binance.US
- Bitfinex
- Bitstamp
- CEX.IO
- Coinbase
- itBit
- Kraken

#### Obsługiwane Kryptowaluty
Każda giełda obsługuje różne zestawy kryptowalut:
- Bitcoin (BTC)
- Bitcoin Cash (BCH)
- Dash (DASH)
- Ethereum (ETH)
- Litecoin (LTC)
- Zcash (ZEC)
- Tron (TRX)
- USDT (w różnych sieciach)
- USDC
- Lightning Network (LN)

#### Funkcjonalności
- Automatyczne wykrywanie dostępnych rynków
- Dwa typy zleceń:
  - Market orders (zlecenia rynkowe)
  - Limit orders (zlecenia z limitem ceny)
- Automatyczne obliczanie optymalnych cen na podstawie orderbook
- Obsługa różnych precyzji cen i ilości dla różnych giełd
- Cache'owanie informacji o rynkach (tygodniowy okres ważności)
- Obsługa błędów i logowanie

#### Konfiguracja Giełd
Każda giełda wymaga:
- Kluczy API (API key)
- Sekretu API (API secret)
- Opcjonalnie: dodatkowych parametrów specyficznych dla giełdy

#### Bezpieczeństwo
- Walidacja konfiguracji przed użyciem
- Obsługa błędów na poziomie API
- Cache'owanie wrażliwych danych
- Logowanie operacji

#### Integracja z Systemem
System Lamassu używa giełd do:
- Kupna kryptowalut dla użytkowników
- Sprzedaży kryptowalut od użytkowników
- Pobierania aktualnych cen
- Zarządzania płynnością

### 9.2 Inne Integracje
- Vonage (SMS)
- Twilio
- Telnyx
- Mailgun
- BitGo (portfele kryptowalutowe)

## 10. Monitoring i Logowanie
- Winston (system logowania)
- Poziomy logowania konfigurowalne przez LOG_LEVEL

## 11. Rozwój
- Pull requests są akceptowane po konsultacji z zespołem
- Wymagane testy dla nowych funkcjonalności
- Dokumentacja kodu jest obowiązkowa

## 12. Wersjonowanie
- Aktualna wersja: 10.2.0
- System semver (Semantic Versioning)

## 13. Licencja
- Szczegóły licencji w pliku LICENSE

## 14. Wsparcie
- Dokumentacja: https://lamassu.is
- Wsparcie techniczne: support@lamassu.is 