export interface IAssetData {
  symbol: string
  name: string
  decimals: string
  contractAddress: string
  balance?: string
}

export interface IChainData {
  name: string
  short_name: string
  chain: string
  network: string
  chain_id: number
  network_id: number
  rpc_url: string
  native_currency: IAssetData
}

export type StateType = {
  provider?: any
  web3Provider?: any
  address?: string
  chainId?: number
  ownersAssets?: any[]
  marketAssets?: any[]
  marketAssetsLoading: boolean
  ownersAssetsLoading: boolean
}

export type ActionType =
  | {
    type: "SET_WEB3_PROVIDER"
    provider?: StateType["provider"]
    web3Provider?: StateType["web3Provider"]
    address?: StateType["address"]
    chainId?: StateType["chainId"]
  }
  | {
    type: "SET_ADDRESS"
    address?: StateType["address"]
    ownersAssets?: StateType["ownersAssets"]
    marketAssets?: StateType["marketAssets"]
  }
  | {
    type: "SET_CHAIN_ID"
    chainId?: StateType["chainId"]
  }
  | {
    type: "RESET_WEB3_PROVIDER"
  }
  | {
    type: "FETCH_OWNERS_ASSETS_START"
    ownersAssetsLoading?: StateType["ownersAssetsLoading"]
  }
  | {
    type: "FETCH_MARKET_ASSETS_START"
    marketAssetsLoading?: StateType["marketAssetsLoading"]
  }
  | {
    type: "FETCH_OWNERS_ASSETS_SUCCESS"
    ownersAssets?: StateType["ownersAssets"]
    ownersAssetsLoading?: StateType["ownersAssetsLoading"]
  }
  | {
    type: "FETCH_MARKET_ASSETS_SUCCESS"
    marketAssets?: StateType["marketAssets"]
    marketAssetsLoading?: StateType["marketAssetsLoading"]
  }

  export type OfferType = {
    id: number
    offeror: string
    price: number
  }

  export type AssetType = {
    id: string
    name: string
    tokens: AssetTokenType[]
    canCreateToken?: boolean
  }

  export type AssetTokenType = {
    id: string
    collectionId: string
    price: number
    forSale: boolean
    owner: string
    offersCount: number
    acceptOffers?: boolean
    canSale?: boolean
    hasOffers?: boolean
    description: string
    name: string
    image: string
  }

  export type TokenType = {
    tokenId: string
    collectionId: string
    price: number
    forSale: boolean
    owner: string
    offersCount: number
  }

  export type MetaType = {
    name: string
    image?: string
    description?: string
  }
