# NFT Marketplace Live Test - Ropsten Flow

### Installation

1. [Install Web](web/README.md#Installation)
2. [Install Hardhat](sol/README.md#Installation)

### Deployment

#### Deploy NFT Marketplace
1. Set the Ropsten environment variables in `nft-marketplace\sol\.env`.
            
```Example
ETHERSCAN_API_KEY=// Optional
ROPSTEN_URL=https://ropsten.infura.io/v3/<INFURA_ID>
PRIVATE_KEY=// The account eth wallet private key
```

The owner wallet private key can be retrieved from Metamask.

2. Compile the contracts

`evm-token-bridge> cd sol`
   
`evm-token-bridge> npx hardhat compile`

3. Deploy NFT Marketplace on Ropsten.
            
`nft-marketplace\sol> npx hardhat run --network ropsten scripts/deploy.ts`

4. Write down the contracts addresses from the console. We will need them later.
```
NFT deployed to: 0x...
Collection deployed to: 0x...
Market deployed to: 0x...
```

**Verify market contract deployment(Require: ETHERSCAN_API_KEY in .env)**
- Verify Market deployment: `npx hardhat verify --network ropsten <MARKET_ADDRESS> "<NFT_ADDRESS>" "<Market_ADDRESS>"`

5. (Optional) To copy the contracts json files if changed execute `nft-marketplace> ./copy_contracts.sh`.

6. Set the React app environment variables in `nft-marketplace\web\.env` with the contracts addresses being deployed.
            
```Example
REACT_APP_NFT_CONTRACT_ADDRESS=// The token contract address from `step 4`
REACT_APP_COLLECTION_CONTRACT_ADDRESS=// The collection contract address from `step 4`
REACT_APP_MARKET_CONTRACT_ADDRESS=// The market contract address from `step 4`
```

7. Start the React App.
            
`nft-marketplace> cd web`

`nft-marketplace\web> yarn start`