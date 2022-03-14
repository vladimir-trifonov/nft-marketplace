import NFT from "../constants/abis/NFT.json"
import Market from "../constants/abis/Market.json"
import { toast } from 'react-toastify'
import { useCallback, useEffect, useState } from "react"
import { getContract } from "../helpers/ethers"
import { groupBy, ellipseAddress } from "../helpers/utilities"
import axios from "axios"
import { utils } from "ethers"

const nftContractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS as string
const marketContractAddress = process.env.REACT_APP_MARKET_CONTRACT_ADDRESS as string
const zeroAddr = "0x0000000000000000000000000000000000000000"
const gasLimit = 6721975

const useWeb3Contracts = (state: any, dispatch: any): any => {

  const { web3Provider, chainId, address, ownersCollections, marketCollections, marketCollectionsLoading, ownersCollectionsLoading } = state

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
      const transaction = await marketContract.createCollection(id, { gasLimit })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onCreateToken = async (id: string, collectionId: string) => {
    try {
      const transaction = await marketContract.mintToken(id, collectionId, { gasLimit })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onBuyToken = async (tokenId: string, price: any, collectionId: string) => {
    try {
      const transaction = await marketContract.buyToken(tokenId, collectionId, { gasLimit, value: price })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onMakeTokenOffer = async (tokenId: string, price: string) => {
    try {
      const transaction = await marketContract.makeOffer(tokenId, { gasLimit, value: utils.parseEther(price.toString()) })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onListTokenForSale = async (tokenId: string) => {
    try {
      const transaction = await marketContract.listTokenForSale(tokenId, { gasLimit })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onAcceptTokenOffer = async (tokenId: string, offerId: number) => {
    try {
      const transaction = await marketContract.acceptOffer(tokenId, offerId, { gasLimit })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const fetchTokenOffers = async (tokenId: string) => {
    try {
      const tokenOffers = await marketContract.fetchTokenOffers(tokenId, { gasLimit })
      return tokenOffers?.map((offer: any, i: number) => ({
        id: offer[0],
        offeror: offer[1],
        price: utils.formatEther(offer[2].toString()).toString()
      }))
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const fetchMarketCollections = async () => {
    if (marketCollectionsLoading) return

    dispatch({
      type: "FETCH_MARKET_COLLECTIONS_START"
    })

    try {
      const marketCollections = await marketContract.fetchMarketCollections()
      let items = await Promise.all(marketCollections[0].map(async (collection: any, i: number) => {
        const collectionUri = await marketContract.uri(collection[1])
        const collectionMeta: any = await axios.get(collectionUri)
        return {
          id: collection[1].toString(),
          name: collectionMeta.data.name,
          tokens: await Promise.all(marketCollections[1]?.[i].map(async (token: any) => {
            const tokenUri = await nftContract.uri(token[1])
            const tokenMeta: any = await axios.get(tokenUri)
            return {
              id: token[1].toString(),
              name: tokenMeta.data.name,
              description: tokenMeta.data.description,
              price: token[2],
              forSale: token[3] !== zeroAddr
            }
          }))
        }
      }))

      const marketTokensGrouped = (groupBy(marketCollections[2], (token: any) => {
        if (token[3] !== zeroAddr) {
          return token[3]
        }
        return token[4]
      }) as any).toJSON()
      if (marketTokensGrouped?.length) {
        const marketTokensOwned = await Promise.all(marketTokensGrouped.map(async (tokensGroup: any) => {
          return {
            id: tokensGroup[0].toString(),
            name: ellipseAddress(tokensGroup[0].toString()),
            tokens: await Promise.all(tokensGroup[1].map(async (token: any) => {
              const tokenUri = await nftContract.uri(token[1])
              const tokenMeta: any = await axios.get(tokenUri)
              return {
                id: token[1].toString(),
                name: tokenMeta.data.name,
                description: tokenMeta.data.description,
                acceptOffers: token[3] !== zeroAddr
              }
            }))
          }
        }))
        items = [...items, ...marketTokensOwned]
      }

      dispatch({
        type: "FETCH_MARKET_COLLECTIONS_SUCCESS",
        marketCollections: items
      })
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const fetchOwnersCollections = async () => {
    if (ownersCollectionsLoading) return

    dispatch({
      type: "FETCH_OWNERS_COLLECTIONS_START"
    })

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
              name: tokenMeta.data.name,
              description: tokenMeta.data.description
            }
          })),
          canCreateToken: true
        }
      }))

      const ownedTokensGrouped = (groupBy(ownersCollections[2], (token: any) => {
        if (token[3] !== zeroAddr) {
          return token[3]
        }
        return token[4]
      }) as any).toJSON()
      if (ownedTokensGrouped?.length) {
        items.push({
          id: ownedTokensGrouped[0][0],
          name: ellipseAddress(ownedTokensGrouped[0][0]),
          tokens: await Promise.all(ownedTokensGrouped[0][1].map(async (token: any) => {
            const tokenUri = await nftContract.uri(token[1])
            const tokenMeta: any = await axios.get(tokenUri)
            return {
              id: token[1],
              name: tokenMeta.data.name,
              description: tokenMeta.data.description,
              canSale: token[3] === zeroAddr,
              hasOffers: token[5][0].toNumber() !== 0
            }
          }))
        })
      }

      dispatch({
        type: "FETCH_OWNERS_COLLECTIONS_SUCCESS",
        ownersCollections: items
      })
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  return [
    { onCreateCollection, onCreateToken, fetchOwnersCollections, fetchMarketCollections, onBuyToken, onListTokenForSale, onMakeTokenOffer, onAcceptTokenOffer, fetchTokenOffers },
    { address, marketContract, ownersCollections, marketCollections }]
}

export default useWeb3Contracts