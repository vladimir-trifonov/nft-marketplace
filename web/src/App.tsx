import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import { useEffect, useReducer } from "react"
import { toast } from "react-toastify"
import { useErrorBoundary } from "use-error-boundary"

import useWeb3Connect from "./hooks/useWeb3Connect"
import useWeb3Contracts from "./hooks/useWeb3Contracts"
import NetworkInfo from "./components/NetworkInfo"
import Marketplace from "./components/Marketplace"
import reducer, { initialState } from "./reducer"

export const App = (): JSX.Element => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { marketAssetsLoading, ownersAssetsLoading } = state
  const [
    { connect, disconnect },
    { chainData, web3Provider, address },
  ] = useWeb3Connect(state, dispatch)
  const [
    {
      onCreateCollection,
      onCreateToken,
      fetchOwnersAssets,
      fetchMarketAssets,
      onBuyToken,
      onListTokenForSale,
      onMakeTokenOffer,
      onAcceptTokenOffer,
      fetchTokenOffers
    },
    { marketContract, nftContract, collectionContract, ownersAssets, marketAssets },
  ] = useWeb3Contracts(state, dispatch)

  useEffect(() => {
    if (didCatch && error) {
      toast.error(error.message)
    }
  }, [didCatch, error])

  return (
    <ErrorBoundary>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "rgba(26,2,52,1)" }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "row" }}>
              <Typography
                sx={{ color: "#8c47d5" }}
                variant="h6"
                component="div"
              >
                NFT&nbsp;
              </Typography>
              <Typography variant="h6" component="div">
                Marketplace
              </Typography>
            </Box>
            {!!chainData && (
              <NetworkInfo chainData={chainData} address={address} />
            )}
            {!!web3Provider && !chainData && (
              <Typography
                sx={{ color: "red", mr: 1 }}
                variant="caption"
                component="div"
              >
                Not supported chain
              </Typography>
            )}
            {web3Provider ? (
              <Button color="inherit" onClick={disconnect}>
                Disconnect
              </Button>
            ) : (
              <Button color="inherit" onClick={connect}>
                Connect
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      {chainData && web3Provider && (
        <Container fixed sx={{ height: "80vh" }}>
          <Grid
            container
            sx={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item>
              <Marketplace
                address={address}
                web3Provider={web3Provider}
                marketContract={marketContract}
                collectionContract={collectionContract}
                nftContract={nftContract}
                onCreateCollection={onCreateCollection}
                onCreateToken={onCreateToken}
                onBuyToken={onBuyToken}
                onListTokenForSale={onListTokenForSale}
                onMakeTokenOffer={onMakeTokenOffer}
                onAcceptTokenOffer={onAcceptTokenOffer}
                fetchOwnersAssets={fetchOwnersAssets}
                fetchMarketAssets={fetchMarketAssets}
                ownersAssets={ownersAssets}
                marketAssets={marketAssets}
                marketAssetsLoading={marketAssetsLoading}
                ownersAssetsLoading={ownersAssetsLoading}
                fetchTokenOffers={fetchTokenOffers}
              />
            </Grid>
          </Grid>
        </Container>
      )}
    </ErrorBoundary>
  )
}

export default App
