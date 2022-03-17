import NFT from '../constants/abis/NFTEnumerable.json'
import Collection from '../constants/abis/Collection.json'
import Market from '../constants/abis/Market.json'
import { toast } from 'react-toastify'
import { useCallback, useEffect, useState } from 'react'
import { getContract } from '../helpers/ethers'
import { groupBy, ellipseAddress } from '../helpers/utilities'
import axios from 'axios'
import { utils } from 'ethers'

const nftContractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS as string
const collectionContractAddress = process.env
  .REACT_APP_COLLECTION_CONTRACT_ADDRESS as string
const marketContractAddress = process.env
  .REACT_APP_MARKET_CONTRACT_ADDRESS as string
const zeroAddr = '0x0000000000000000000000000000000000000000'

const useWeb3Contracts = (state: any, dispatch: any): any => {
  const {
    web3Provider,
    chainId,
    address,
    ownersAssets,
    marketAssets,
    marketAssetsLoading,
    ownersAssetsLoading,
  } = state

  const [nftContract, setNFTContract] = useState<null | any>(null)
  const [collectionContract, setCollectionContract] = useState<null | any>(null)
  const [marketContract, setMarketContract] = useState<null | any>(null)

  const clearContracts = () => {
    setNFTContract(null)
    setCollectionContract(null)
    setMarketContract(null)
  }

  const initContracts = useCallback(
    async function () {
      try {
        setNFTContract(
          getContract(
            nftContractAddress as string,
            NFT.abi,
            web3Provider.getSigner(),
          ),
        )
        setCollectionContract(
          getContract(
            collectionContractAddress as string,
            Collection.abi,
            web3Provider.getSigner(),
          ),
        )
        setMarketContract(
          getContract(
            marketContractAddress as string,
            Market.abi,
            web3Provider.getSigner(),
          ),
        )
      } catch (e: any) {
        toast.info(e.message)
        console.warn(e)
      }
    },
    [web3Provider],
  )

  useEffect(() => {
    if (web3Provider && chainId) {
      initContracts()
    } else {
      clearContracts()
    }
  }, [chainId, initContracts, web3Provider])

  const onCreateCollection = async (id: string) => {
    try {
      const transaction = await marketContract.createCollection(id)
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onCreateToken = async (id: string, collectionId: string) => {
    try {
      const transaction = await marketContract.mintToken(id, collectionId)
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onBuyToken = async (
    tokenId: string,
    price: any,
    collectionId: string,
  ) => {
    try {
      const transaction = await marketContract.buyToken(tokenId, collectionId, {
        value: price,
      })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onListTokenForSale = async (tokenId: string) => {
    try {
      const transaction = await marketContract.listTokenForSale(tokenId)
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onMakeTokenOffer = async (tokenId: string, price: string) => {
    try {
      const transaction = await marketContract.makeOffer(tokenId, {
        value: utils.parseEther(price.toString()),
      })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const onAcceptTokenOffer = async (tokenId: string, offerId: number) => {
    try {
      const transaction = await marketContract.acceptOffer(tokenId, offerId)
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const fetchTokenOffers = async (tokenId: string) => {
    try {
      const tokenOffers = await marketContract.fetchTokenOffers(tokenId)
      return tokenOffers?.map((offer: any, i: number) => ({
        id: offer[0],
        offeror: offer[1],
        price: utils.formatEther(offer[2].toString()).toString(),
      }))
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }

  const resolveCollectionsTokens = useCallback(async (
    collectionsIds: any,
    collectionsTokensGrouped: any,
    collectionsCanCreateTokens: boolean,
    includeForSaleInfo: boolean) => Promise.all(
      collectionsIds.map(async (collectionId: string) => {
        const collectionUri = await collectionContract.uri(collectionId)
        const collectionMeta: any = await axios.get(collectionUri)
        return {
          id: collectionId,
          name: collectionMeta.data.name,
          tokens:
            collectionsTokensGrouped.size === 0 ||
              !collectionsTokensGrouped.get(collectionId.toString())
              ? []
              : await Promise.all(
                collectionsTokensGrouped
                  .get(collectionId.toString())
                  ?.map(async (token: any) => {
                    const tokenUri = await nftContract.uri(token.tokenId)
                    const tokenMeta: any = await axios.get(tokenUri)
                    return {
                      id: token.tokenId,
                      name: tokenMeta.data.name,
                      image: tokenMeta.data.image,
                      description: tokenMeta.data.description,
                      ...(includeForSaleInfo && {
                        price: token.price,
                        forSale: token.forSale
                      })
                    }
                  }),
              ),
          canCreateToken: collectionsCanCreateTokens,
        }
      }),
    ), [collectionContract, nftContract])

  const fetchMarketAssets = useCallback(async () => {
    if (marketAssetsLoading) return
    let items: any = []

    dispatch({
      type: 'FETCH_MARKET_ASSETS_START',
    })

    try {
      const tokensIds = await nftContract.fetchTokensIdsBatch(address, zeroAddr)

      if (tokensIds.length) {
        const marketTokens = (await marketContract.fetchTokensBatch(tokensIds))?.filter(({ forSale }: { forSale: boolean }) => forSale)

        const collectionTokensGrouped = groupBy(
          marketTokens.filter(
            (token: any) => token.collectionId.toString() !== '0',
          ),
          (token: any) => token.collectionId.toString(),
        )

        const collectionsIds = Array.from(
          new Set(
            marketTokens
              .filter((token: any) => token.collectionId.toString() !== '0')
              .map((token: any) => token.collectionId.toString()),
          ),
        ) as string[]

        items = await resolveCollectionsTokens(collectionsIds, collectionTokensGrouped, false, true)

        const ownerTokensGrouped = groupBy(
          marketTokens.filter(
            (token: any) => token.collectionId.toString() === '0',
          ),
          (token: any) => token.owner,
        )

        const owners = Array.from(
          new Set(
            marketTokens
              .filter((token: any) => token.collectionId.toString() === '0')
              .map((token: any) => token.owner),
          ),
        ) as string[]

        if (owners.length) {
          const marketTokensOwned = await Promise.all(
            owners.map(async (owner: string) => {
              return {
                id: owner,
                name: ellipseAddress(owner),
                tokens:
                  ownerTokensGrouped.size === 0 ||
                    !ownerTokensGrouped.get(owner)
                    ? []
                    : await Promise.all(
                      ownerTokensGrouped
                        .get(owner)
                        ?.map(async (token: any) => {
                          const tokenUri = await nftContract.uri(
                            token.tokenId,
                          )
                          const tokenMeta: any = await axios.get(tokenUri)
                          return {
                            id: token.tokenId,
                            name: tokenMeta.data.name,
                            image: tokenMeta.data.image,
                            description: tokenMeta.data.description,
                            price: token.price,
                            acceptOffers: token.forSale,
                          }
                        }),
                    ),
              }
            }),
          )

          items = [...items, ...marketTokensOwned]
        }
      }

      dispatch({
        type: 'FETCH_MARKET_ASSETS_SUCCESS',
        marketAssets: items,
      })
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }, [address, dispatch, marketAssetsLoading, marketContract, nftContract, resolveCollectionsTokens])

  const fetchOwnersAssets = useCallback(async () => {
    if (ownersAssetsLoading) return
    let items: any = []

    dispatch({
      type: 'FETCH_OWNERS_ASSETS_START',
    })

    try {
      const [collectionsIds, tokensIds] = await Promise.all([
        collectionContract.collectionsIdsByCreator(address),
        nftContract.fetchTokensIdsBatch(zeroAddr, address),
      ])

      const ownerTokens = await marketContract.fetchTokensBatch(tokensIds)

      if (collectionsIds.length || ownerTokens.length) {
        const collectionTokensGrouped = groupBy(
          ownerTokens.filter(
            (token: any) => token.collectionId.toString() !== '0',
          ),
          (token: any) => token.collectionId.toString(),
        )

        items = await resolveCollectionsTokens(collectionsIds, collectionTokensGrouped, true, false)

        const ownedTokens = ownerTokens.filter(
          (token: any) => token.collectionId.toString() === '0',
        )

        if (ownedTokens.length) {
          const tokensOwned = {
            id: ownedTokens[0].owner,
            name: ellipseAddress(ownedTokens[0].owner),
            tokens: await Promise.all(
              ownedTokens.map(async (token: any) => {
                const tokenUri = await nftContract.uri(token.tokenId)
                const tokenMeta: any = await axios.get(tokenUri)
                return {
                  id: token.tokenId,
                  name: tokenMeta.data.name,
                  image: tokenMeta.data.image,
                  description: tokenMeta.data.description,
                  price: token.price,
                  canSale: token.forSale === false,
                  hasOffers: token.offersCount > 0,
                }
              }),
            ),
          }

          items = [...items, tokensOwned]
        }
      }

      dispatch({
        type: 'FETCH_OWNERS_ASSETS_SUCCESS',
        ownersAssets: items,
      })
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }, [address, collectionContract, dispatch, marketContract, nftContract, ownersAssetsLoading, resolveCollectionsTokens])

  const onMarketUpdated = useCallback(() => {
    fetchOwnersAssets()
  }, [fetchOwnersAssets])

  useEffect(() => {
    if (address && marketContract?.on) {
      const onCollectionCreatedFilter = marketContract.filters.CollectionCreated(
        address,
      )
      marketContract.on(onCollectionCreatedFilter, onMarketUpdated)

      const onTokenListedForSaleFilter = marketContract.filters.TokenListedForSale(
        address,
      )
      marketContract.on(onTokenListedForSaleFilter, onMarketUpdated)

      const onTokenMintedFilter = marketContract.filters.TokenMinted(address)
      marketContract.on(onTokenMintedFilter, onMarketUpdated)

      const onTokenSoldFilter = marketContract.filters.TokenSold(address)
      marketContract.on(onTokenSoldFilter, onMarketUpdated)

      const onOfferCreatedFilter = marketContract.filters.OfferCreated(address)
      marketContract.on(onOfferCreatedFilter, onMarketUpdated)

      const onOfferAcceptedFilter = marketContract.filters.OfferAccepted(
        address,
      )
      marketContract.on(onOfferAcceptedFilter, onMarketUpdated)

      return () => {
        if (marketContract.off) {
          marketContract.off(onCollectionCreatedFilter, onMarketUpdated)
          marketContract.off(onTokenListedForSaleFilter, onMarketUpdated)
          marketContract.off(onTokenMintedFilter, onMarketUpdated)
          marketContract.off(onTokenSoldFilter, onMarketUpdated)
          marketContract.off(onOfferCreatedFilter, onMarketUpdated)
          marketContract.off(onOfferAcceptedFilter, onMarketUpdated)
        }
      }
    }
  }, [address, marketContract, onMarketUpdated])

  return [
    {
      onCreateCollection,
      onCreateToken,
      fetchOwnersAssets,
      fetchMarketAssets,
      onBuyToken,
      onListTokenForSale,
      onMakeTokenOffer,
      onAcceptTokenOffer,
      fetchTokenOffers,
    },
    {
      address,
      marketContract,
      nftContract,
      collectionContract,
      ownersAssets,
      marketAssets,
    },
  ]
}

export default useWeb3Contracts
