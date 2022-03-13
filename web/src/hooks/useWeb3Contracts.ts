import NFT from "../constants/abis/NFT.json"
import Market from "../constants/abis/Market.json"
import { toast } from 'react-toastify'
import { useCallback, useEffect, useState } from "react"
import { getContract } from "../helpers/ethers"
import { groupBy } from "../helpers/utilities"
import axios from "axios"
import { utils } from "ethers"

const nftContractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS as string
const marketContractAddress = process.env.REACT_APP_MARKET_CONTRACT_ADDRESS as string


const useWeb3Contracts = (state: any, dispatch: any): any => {
  const { web3Provider, chainId, address, ownersCollections, marketCollections } = state

  const [nftContract, setNFTContract] = useState<null | any>(null)
  const [marketContract, setMarketContract] = useState<null | any>(null)

  const clearContracts = () => {
    setNFTContract(null)
    setMarketContract(null)
  }

  const initContracts = useCallback(async function () {
    try {  
      setNFTContract(getContract(nftContractAddress as string, NFT.abi, web3Provider.getSigner()))
      setMarketContract(getContract(marketContractAddress as string, Market.abi, web3Provider.getSigner()))
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }, [web3Provider])
  
  useEffect(() => {
    if (web3Provider && chainId) {
      initContracts()
    } else {
      clearContracts()
    }
  }, [chainId, initContracts, web3Provider])

  const onCreateCollection = async (id: string) => {
    try {
      const transaction = await marketContract.createCollection(id, { gasLimit: 6721975 })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onCreateToken = async (id: string, collectionId: string) => {
    try {
      const transaction = await marketContract.mintToken(id, collectionId, { gasLimit: 6721975 })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onBuyToken = async (tokenId: string, collectionId: string) => {
    try {
      // const transaction = await marketContract.makeOffer(tokenId, { gasLimit: 6721975, value: utils.parseEther('0.005') })
      const transaction = await marketContract.buyToken(tokenId, collectionId, { gasLimit: 6721975, value: utils.parseEther('0.005') })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onListTokenForSale = async (tokenId: string) => {
    try {
      const transaction = await marketContract.listTokenForSale(tokenId, { gasLimit: 6721975 })
      // const transaction = await marketContract.acceptOffer(tokenId, 0, { gasLimit: 6721975 })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }
  
  const fetchMarketCollections = async () => {
    try {
      const marketCollections = await marketContract.fetchMarketCollections()
      let items = await Promise.all(marketCollections[0].map(async (collection: any, i: number) => {
        const collectionUri = await marketContract.uri(collection[1])
        const collectionMeta: any = await axios.get(collectionUri)
        return {
          id: collection[1],
          name: collectionMeta.data.name,
          tokens: await Promise.all(marketCollections[1]?.[i].map(async (token: any) => {
            const tokenUri = await nftContract.uri(token[1])
            const tokenMeta: any = await axios.get(tokenUri)
            return {
              id: token[1],
              name: tokenMeta.data.name
            }
          }))
        }
      }))

      const marketTokensGrouped = (groupBy(marketCollections[2], (token: any) => {
        if (token[3] !== "0x0000000000000000000000000000000000000000") {
          return token[3]
        }
        return token[4]
      }) as any).toJSON()
      if (marketTokensGrouped?.length) {
        const marketTokensOwned = await Promise.all(marketTokensGrouped.map(async (tokensGroup: any) => {
          return {
            id: tokensGroup[0],
            name: tokensGroup[0],
            tokens: await Promise.all(tokensGroup[1].map(async (token: any) => {
              const tokenUri = await nftContract.uri(token[1])
              const tokenMeta: any = await axios.get(tokenUri)
              return {
                id: token[1],
                name: tokenMeta.data.name
              }
            }))
          }
        }))
        items = [...items, ...marketTokensOwned]
      }

      dispatch({
        type: "SET_MARKET_COLLECTIONS",
        marketCollections: items
      })
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }
  
  const fetchOwnersCollections = async () => {
    try {
      const ownersCollections = await marketContract.fetchOwnersCollections()
      const items = await Promise.all(ownersCollections[0].map(async (collection: any, i: number) => {
        const collectionUri = await marketContract.uri(collection[1])
        const collectionMeta: any = await axios.get(collectionUri)
        return {
          id: collection[1],
          name: collectionMeta.data.name,
          tokens: await Promise.all(ownersCollections[1]?.[i].map(async (token: any) => {
            const tokenUri = await nftContract.uri(token[1])
            const tokenMeta: any = await axios.get(tokenUri)
            return {
              id: token[1],
              name: tokenMeta.data.name
            }
          }))
        }
      }))

      const ownedTokensGrouped = (groupBy(ownersCollections[2], (token: any) => {
        if (token[3] !== "0x0000000000000000000000000000000000000000") {
          return token[3]
        }
        return token[4]
      }) as any).toJSON()
      if (ownedTokensGrouped?.length) items.push({
        id: ownedTokensGrouped[0][0],
        name: ownedTokensGrouped[0][0],
        tokens: await Promise.all(ownedTokensGrouped[0][1].map(async (token: any) => {
          const tokenUri = await nftContract.uri(token[1])
          const tokenMeta: any = await axios.get(tokenUri)
          return {
            id: token[1],
            name: tokenMeta.data.name
          }
        }))
      })
      
      dispatch({
        type: "SET_OWNERS_COLLECTIONS",
        ownersCollections: items
      })
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  return [{ onCreateCollection, onCreateToken, fetchOwnersCollections, fetchMarketCollections, onBuyToken, onListTokenForSale }, { address, marketContract, ownersCollections, marketCollections }]
}

export default useWeb3Contracts