type StateType = {
  provider?: any
  web3Provider?: any
  address?: string
  chainId?: number
  ownersCollections?: any[]
  marketCollections?: any[]
  marketCollectionsLoading: boolean
  ownersCollectionsLoading: boolean
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
    ownersCollections?: StateType["ownersCollections"]
    marketCollections?: StateType["marketCollections"]
  }
  | {
    type: "SET_CHAIN_ID"
    chainId?: StateType["chainId"]
  }
  | {
    type: "RESET_WEB3_PROVIDER"
  }
  | {
    type: "FETCH_OWNERS_COLLECTIONS_START"
    ownersCollectionsLoading?: StateType["ownersCollectionsLoading"]
  }
  | {
    type: "FETCH_MARKET_COLLECTIONS_START"
    marketCollectionsLoading?: StateType["marketCollectionsLoading"]
  }
  | {
    type: "FETCH_OWNERS_COLLECTIONS_SUCCESS"
    ownersCollections?: StateType["ownersCollections"]
    ownersCollectionsLoading?: StateType["ownersCollectionsLoading"]
  }
  | {
    type: "FETCH_MARKET_COLLECTIONS_SUCCESS"
    marketCollections?: StateType["marketCollections"]
    marketCollectionsLoading?: StateType["marketCollectionsLoading"]
  }

export const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: undefined,
  chainId: undefined,
  ownersCollections: undefined,
  marketCollections: undefined,
  marketCollectionsLoading: false,
  ownersCollectionsLoading: false
}

const reducer = (state: StateType = initialState, action: ActionType): StateType => {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      }
    case "SET_ADDRESS":
      return {
        ...state,
        address: action.address,
        marketCollections: undefined,
        ownersCollections: undefined
      }
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId,
      }
    case "FETCH_MARKET_COLLECTIONS_START":
      return {
        ...state,
        marketCollectionsLoading: true,
      }
    case "FETCH_OWNERS_COLLECTIONS_START":
      return {
        ...state,
        ownersCollectionsLoading: true,
      }
    case "FETCH_MARKET_COLLECTIONS_SUCCESS":
      return {
        ...state,
        marketCollectionsLoading: false,
        marketCollections: action.marketCollections,
      }
    case "FETCH_OWNERS_COLLECTIONS_SUCCESS":
      return {
        ...state,
        ownersCollectionsLoading: false,
        ownersCollections: action.ownersCollections,
      }
    case "RESET_WEB3_PROVIDER":
      return initialState
    default:
      throw new Error()
  }
}

export default reducer