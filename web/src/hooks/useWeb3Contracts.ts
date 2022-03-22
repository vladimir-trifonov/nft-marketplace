import { toast } from 'react-toastify'
import { Dispatch, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { utils, Contract } from 'ethers'

import { getContract } from '../helpers/ethers'
import { groupBy, ellipseAddress } from '../helpers/utilities'
import NFT from '../constants/abis/NFTEnumerable.json'
import Collection from '../constants/abis/Collection.json'
import Market from '../constants/abis/Market.json'
import { StateType, TokenType, MetaType, AssetType, OfferType } from '../types'

const nftContractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS
const collectionContractAddress = process.env
  .REACT_APP_COLLECTION_CONTRACT_ADDRESS
const marketContractAddress = process.env
  .REACT_APP_MARKET_CONTRACT_ADDRESS
const zeroAddr = '0x0000000000000000000000000000000000000000'

const useWeb3Contracts = (state: StateType, dispatch: Dispatch<any>): any => {
  const {
    web3Provider,
    chainId,
    address,
    ownersAssets,
    marketAssets,
    marketAssetsLoading,
    ownersAssetsLoading,
  } = state

  const [nftContract, setNFTContract] = useState<null | Contract>(null)
  const [collectionContract, setCollectionContract] = useState<null | Contract>(null)
  const [marketContract, setMarketContract] = useState<null | Contract>(null)

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
            nftContractAddress!,
            NFT.abi,
            web3Provider.getSigner(),
          ),
        )
        setCollectionContract(
          getContract(
            collectionContractAddress!,
            Collection.abi,
            web3Provider.getSigner(),
          ),
        )
        setMarketContract(
          getContract(
            marketContractAddress!,
            Market.abi,
            web3Provider.getSigner(),
          ),
        )
      } catch (e: any) {
        toast.info(e.message)
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
      const transaction = await marketContract!.createCollection(id)
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
    }
  }

  const onCreateToken = async (id: string, collectionId: string) => {
    try {
      const transaction = await marketContract!.mintToken(id, collectionId)
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
    }
  }

  const onBuyToken = async (
    tokenId: string,
    price: number,
    collectionId: string,
  ) => {
    try {
      const transaction = await marketContract!.buyToken(tokenId, collectionId, {
        value: price,
      })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
    }
  }

  const onListTokenForSale = async (tokenId: string) => {
    try {
      const transaction = await marketContract!.listTokenForSale(tokenId)
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
    }
  }

  const onMakeTokenOffer = async (tokenId: string, price: string) => {
    try {
      const transaction = await marketContract!.makeOffer(tokenId, {
        value: utils.parseEther(price.toString()),
      })
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
    }
  }

  const onAcceptTokenOffer = async (tokenId: string, offerId: number) => {
    try {
      const transaction = await marketContract!.acceptOffer(tokenId, offerId)
      await transaction.wait()
    } catch (e: any) {
      toast.info(e.message)
    }
  }

  const fetchTokenOffers = async (tokenId: string): Promise<OfferType[] | undefined> => {
    try {
      const tokenOffers = await marketContract!.fetchTokenOffers(tokenId)
      return tokenOffers?.map((offer: OfferType, i: number) => ({
        id: offer.id,
        offeror: offer.offeror,
        price: utils.formatEther(offer.price.toString()).toString(),
      }))
    } catch (e: any) {
      toast.info(e.message)
    }
  }

  const resolveCollectionsTokens = useCallback(async (
    collectionsIds: string[],
    collectionsTokensGrouped: Map<string, any>,
    collectionsCanCreateTokens: boolean,
    includeForSaleInfo: boolean) => Promise.all(
      collectionsIds.map(async (collectionId: string) => {
        const collectionUri = await collectionContract!.uri(collectionId)
        const response = await axios.get(collectionUri)
        const collectionMeta: MetaType = response.data
        return {
          id: collectionId,
          name: collectionMeta.name,
          tokens:
            collectionsTokensGrouped.size === 0 ||
              !collectionsTokensGrouped.get(collectionId.toString())
              ? []
              : await Promise.all(
                collectionsTokensGrouped
                  .get(collectionId.toString())
                  ?.map(async (token: TokenType) => {
                    const tokenUri = await nftContract!.uri(token.tokenId)
                    const response = await axios.get(tokenUri)
                    const tokenMeta: MetaType = response.data
                    return {
                      id: token.tokenId,
                      name: tokenMeta.name,
                      image: tokenMeta.image,
                      description: tokenMeta.description,
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
    let items: AssetType[] = []

    dispatch({
      type: 'FETCH_MARKET_ASSETS_START',
    })

    try {
      const tokensIds = await nftContract!.fetchTokensIdsBatch(address, zeroAddr)

      if (tokensIds.length) {
        const marketTokens = (await marketContract!.fetchTokensBatch(tokensIds))?.filter(({ forSale }: { forSale: boolean }) => forSale)

        const collectionTokensGrouped = groupBy(
          marketTokens.filter(
            (token: TokenType) => token.collectionId.toString() !== '0',
          ),
          (token: TokenType) => token.collectionId.toString(),
        )

        const collectionsIds = Array.from(
          new Set(
            marketTokens
              .filter((token: TokenType) => token.collectionId.toString() !== '0')
              .map((token: TokenType) => token.collectionId.toString()),
          ),
        ) as string[]

        items = await resolveCollectionsTokens(collectionsIds, collectionTokensGrouped, false, true)

        const ownerTokensGrouped = groupBy(
          marketTokens.filter(
            (token: TokenType) => token.collectionId.toString() === '0',
          ),
          (token: TokenType) => token.owner,
        )

        const owners = Array.from(
          new Set(
            marketTokens
              .filter((token: TokenType) => token.collectionId.toString() === '0')
              .map((token: TokenType) => token.owner),
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
                        ?.map(async (token: TokenType) => {
                          const tokenUri = await nftContract!.uri(
                            token.tokenId,
                          )
                          const response = await axios.get(tokenUri)
                          const tokenMeta: MetaType = response.data
                          return {
                            id: token.tokenId,
                            name: tokenMeta.name,
                            image: tokenMeta.image,
                            description: tokenMeta.description,
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
    }
  }, [address, dispatch, marketAssetsLoading, marketContract, nftContract, resolveCollectionsTokens])

  const fetchOwnersAssets = useCallback(async () => {
    if (ownersAssetsLoading) return
    let items: AssetType[] = []

    dispatch({
      type: 'FETCH_OWNERS_ASSETS_START',
    })

    try {
      const [collectionsIds, tokensIds] = await Promise.all([
        collectionContract!.collectionsIdsByCreator(address),
        nftContract!.fetchTokensIdsBatch(zeroAddr, address),
      ])

      const ownerTokens = await marketContract!.fetchTokensBatch(tokensIds)

      if (collectionsIds.length || ownerTokens.length) {
        const collectionTokensGrouped = groupBy(
          ownerTokens.filter(
            (token: TokenType) => token.collectionId.toString() !== '0',
          ),
          (token: TokenType) => token.collectionId.toString(),
        )

        items = await resolveCollectionsTokens(collectionsIds, collectionTokensGrouped, true, false)

        const ownedTokens = ownerTokens.filter(
          (token: TokenType) => token.collectionId.toString() === '0',
        )

        if (ownedTokens.length) {
          const tokensOwned = {
            id: ownedTokens[0].owner,
            name: ellipseAddress(ownedTokens[0].owner),
            tokens: await Promise.all(
              ownedTokens.map(async (token: TokenType) => {
                const tokenUri = await nftContract!.uri(token.tokenId)
                const response = await axios.get(tokenUri)
                const tokenMeta: MetaType = response.data
                return {
                  id: token.tokenId,
                  name: tokenMeta.name,
                  image: tokenMeta.image,
                  description: tokenMeta.description,
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
