import { ActionType, StateType } from "./types"

export const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: undefined,
  chainId: undefined,
  ownersAssets: undefined,
  marketAssets: undefined,
  marketAssetsLoading: false,
  ownersAssetsLoading: false
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
        marketAssets: undefined,
        ownersAssets: undefined
      }
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId,
      }
    case "FETCH_MARKET_ASSETS_START":
      return {
        ...state,
        marketAssetsLoading: true,
      }
    case "FETCH_OWNERS_ASSETS_START":
      return {
        ...state,
        ownersAssetsLoading: true,
      }
    case "FETCH_MARKET_ASSETS_SUCCESS":
      return {
        ...state,
        marketAssetsLoading: false,
        marketAssets: action.marketAssets,
      }
    case "FETCH_OWNERS_ASSETS_SUCCESS":
      return {
        ...state,
        ownersAssetsLoading: false,
        ownersAssets: action.ownersAssets,
      }
    case "RESET_WEB3_PROVIDER":
      return initialState
    default:
      throw new Error()
  }
}

export default reducer