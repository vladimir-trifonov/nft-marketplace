# NFT Marketplace 

# Prerequisites
1. [Node.js](https://nodejs.org/en/) version >= v16.14.0 

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

3. Deploy NFT Marketplace on Hadrhat node.

`nft-marketplace> cd sol`
            
`nft-marketplace\sol> npx hardhat run --network localhost scripts/deploy.ts`

4. Write down the contracts addresses from the console. We will need them later.
```
NFT deployed to: 0x...
Market deployed to: 0x...
```

5. (Optional) To copy the contracts json files if changed execute `nft-marketplace> ./copy_contracts.sh`.

6. Set the React app environment variables in `nft-marketplace\web\.env` with the contract address being deployed.
            
```Example
REACT_APP_NFT_CONTRACT_ADDRESS=// The token contract address from `step 4`
REACT_APP_MARKET_CONTRACT_ADDRESS=// The token contract address from `step 4`
```

7. Start the React App.
            
`nft-marketplace> cd web`

`nft-marketplace\web> yarn start`

8. Setup [Metamask by importing the account](https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-Account) for Hardhat with the private key from `step 2`.
  
9. Setup [Metamask by adding the network](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC) for Hardhat.

```
Network Name: Hardhat localhost:8545
New RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

## Help
1. Reset [Metamask Account](https://support.avax.network/en/articles/4872721-metamask-transactions-are-stuck-rejected) if you get error similar to `Nonce too high` in the browser.

## License
[MIT](https://choosealicense.com/licenses/mit/)