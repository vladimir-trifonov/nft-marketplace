# NFT Marketplace Solidity

The project uses Hardhat for solidity smart contracts deployment. 

## Installation

```bash
npm i
```

## Development

1. Set the environment variables in `.env`

```env
ETHERSCAN_API_KEY=
RINKEBY_URL=
PRIVATE_KEY=
```
2. Start Hardhat localhost node

`hardhat node`

3. Deploy FW7 Token and FW7 Token Bridge on Hadrhat node
            
`npx hardhat run --network localhost scripts/deploy-fw7.ts`

## License
[MIT](https://choosealicense.com/licenses/mit/)