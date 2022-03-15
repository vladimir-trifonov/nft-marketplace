import { useCallback, useEffect } from "react"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { providers } from "ethers"
import Web3Modal from "web3modal"
import { toast } from "react-toastify"

import { getChainData } from "../helpers/utilities"

const INFURA_ID = process.env.REACT_APP_INFURA_ID

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_ID,
    },
  }
}

let web3Modal: any
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  })
}

const useWeb3Connect = (state: any, dispatch: any): any => {
  const { provider, chainId } = state
  const chainData = getChainData(chainId)

  const connect = useCallback(async function () {
    try {
      const provider = await web3Modal.connect()
      const web3Provider = new providers.Web3Provider(provider)
      const signer = web3Provider.getSigner()
      const network = await web3Provider.getNetwork()
      const address = await signer.getAddress()

      dispatch({
        type: "SET_WEB3_PROVIDER",
        provider,
        web3Provider,
        address,
        chainId: network?.chainId
      })
    } catch (e: any) {
      toast.info(e.message)
      console.warn(e)
    }
  }, [dispatch])

  const disconnect = useCallback(
    async function () {
      try {
        await web3Modal.clearCachedProvider()
        if (provider?.disconnect && typeof provider.disconnect === "function") {
          await provider.disconnect()
        }
        dispatch({
          type: "RESET_WEB3_PROVIDER",
        })
      } catch (e: any) {
        toast.info(e.message)
        console.warn(e)
      }
    },
    [dispatch, provider]
  )

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("accountsChanged", accounts)
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        })
      }

      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload()
      }

      const handleDisconnect = (error: { code: number, message: string }) => {
        console.log("disconnect", error)
        disconnect()
      }

      provider.on("accountsChanged", handleAccountsChanged)
      provider.on("chainChanged", handleChainChanged)
      provider.on("disconnect", handleDisconnect)

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged)
          provider.removeListener("chainChanged", handleChainChanged)
          provider.removeListener("disconnect", handleDisconnect)
        }
      }
    }
  }, [provider, disconnect, dispatch])

  return [{ connect, disconnect }, { chainData, ...state }]
}

export default useWeb3Connect