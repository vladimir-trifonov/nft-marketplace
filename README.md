# NFT Marketplace [![Coverage Status](https://coveralls.io/repos/github/vladimir-trifonov/nft-marketplace/badge.svg?branch=main)](https://coveralls.io/github/vladimir-trifonov/nft-marketplace?branch=main)

# Prerequisites
1. [Node.js](https://nodejs.org/en/) version >= v16.14.0 

## Live Test - [Ropsten Flow](DEV_LIVE_TEST.md)

## Development

### Installation

1. [Install Web](web/README.md#Installation)
2. [Install Hardhat](sol/README.md#Installation)

### Deployment

#### Deploy NFT Marketplace
1. Start Hardhat.

`nft-marketplace> cd sol`

`nft-marketplace\sol> npx hardhat node`

2. Write down the first available account private key from the console. We will need it later.
```
Private Key: 0x...
```

3. Compile the contracts

`evm-token-bridge> cd sol`
   
`evm-token-bridge> npx hardhat compile`

4. Deploy NFT Marketplace on Hadrhat node.
            
`nft-marketplace\sol> npx hardhat run --network localhost scripts/deploy.ts`

5. Write down the contracts addresses from the console. We will need them later.
```
NFT deployed to: 0x...
Collection deployed to: 0x...
Market deployed to: 0x...
```

6. (Optional) To copy the contracts json files if changed execute `nft-marketplace> ./copy_contracts.sh`.

7. Set the React app environment variables in `nft-marketplace\web\.env` with the contract address being deployed.
            
```Example
REACT_APP_INFURA_ID=
REACT_APP_NFT_CONTRACT_ADDRESS=// The token contract address from `step 5`
REACT_APP_COLLECTION_CONTRACT_ADDRESS=// The collection contract address from `step 5`
REACT_APP_MARKET_CONTRACT_ADDRESS=// The market contract address from `step 5`
GENERATE_SOURCEMAP=false
```

8. Start the React App.
            
`nft-marketplace> cd web`

`nft-marketplace\web> yarn start`

9. Setup [Metamask by importing the account](https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-Account) for Hardhat with the private key from `step 2`.
  
10. Setup [Metamask by adding the network](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC) for Hardhat.

```
Network Name: Hardhat localhost:8545
New RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

## Help
1. Reset [Metamask Account](https://support.avax.network/en/articles/4872721-metamask-transactions-are-stuck-rejected) if you get error similar to `Nonce too high` in the browser.
2. Reset hardhat with `npx hardhat clean` if you get error similar to `HardhatError: HH700: Artifact for contract ... not found.` on deploy.
 
## License
[MIT](https://choosealicense.com/licenses/mit/)