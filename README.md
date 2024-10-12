# ic_crypto_index

IC Crypto Index serves to be a decentralized source of crypto OHLC prices history.
It aims to gather historical prices of selected cryptocurrencies like BTCUSDT, ETHUSDT, etc.
These price history will be indexed, scraped, or gather by an external indexer or app.



# Features

**User Management**

 - user Registration

**OHLC Management**

 * OHLC Registration
 + OHLC retrieval by date range
 
**API Keys Management (WIP)**

 - Aims to retrict retrieval of price history thru API keys/tokens

## Prerequisities

1. Install `nvm`:
- `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`

2. Switch to node v20:
- `nvm install 20`
- `nvm use 20`

3. Install build dependencies:
## For Ubuntu and WSL2
```
sudo apt-get install podman
```
## For macOS:
```
xcode-select --install
brew install podman
```

4. Install `dfx`
- `DFX_VERSION=0.16.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"`

5. Add `dfx` to PATH:
- `echo 'export PATH="$PATH:$HOME/bin"' >> "$HOME/.bashrc"`

## Installation

### To install the project, follow these steps:

1. Clone the repository.
2. Install dependencies using npm install.
3. Execute the project using `dfx start --host 127.0.0.1:8000 --clean`.
4. `dfx deploy `

# Usage

### To get the url to make request Follow the steps below :
* Get deployed Canister's id  
```
 - dfx canister id ENTER_CANISTER_NAME_HERE
```
* Now place the canister id 

```
 http://INSERT_CANISTER_ID_HERE.localhost:8000
```
Now you can make request to the api endpoints to perform operations Using  utility tools like Postman, insomnia ,ThunderClient etc. 

## API Endpoints

* `POST /users/signup` : creates a new user

* `POST /ohlc` : register OHLC data to a certain crypto pair

* `GET /ohlc` : retrieves all OHLC data that meets the query conditions `startDate` and `endDate`

## Contributions

Contributions are welcome to this project. If you want to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your changes.
3. Make your modifications.
4. Submit a pull request.