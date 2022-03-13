type StateType = {
  provider?: any
  web3Provider?: any
  address?: string
  chainId?: number
  ownersCollections?: any[]
  marketCollections?: any[]
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
  }
  | {
    type: "SET_CHAIN_ID"
    chainId?: StateType["chainId"]
  }
  | {
    type: "RESET_WEB3_PROVIDER"
  }
  | {
    type: "SET_OWNERS_COLLECTIONS"
    ownersCollections?: StateType["ownersCollections"]
  }
  | {
    type: "SET_MARKET_COLLECTIONS"
    marketCollections?: StateType["marketCollections"]
  }

export const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: undefined,
  chainId: undefined,
  ownersCollections: [],
  marketCollections: []
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
      }
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId,
      }
    case "SET_OWNERS_COLLECTIONS":
      return {
        ...state,
        ownersCollections: action.ownersCollections,
      }
    case "SET_MARKET_COLLECTIONS":
      return {
        ...state,
        marketCollections: action.marketCollections,
      }
    case "RESET_WEB3_PROVIDER":
      return initialState
    default:
      throw new Error()
  }
}

export default reducer