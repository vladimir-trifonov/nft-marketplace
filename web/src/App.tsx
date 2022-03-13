import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"

import useWeb3Connect from "./hooks/useWeb3Connect"
import useWeb3Contracts from "./hooks/useWeb3Contracts"
import NetworkInfo from "./components/NetworkInfo"
import Marketplace from "./components/Marketplace"
import reducer, { initialState } from "./reducer"
import { useReducer } from "react"
import { useErrorBoundary } from "use-error-boundary"

export const Home = (): JSX.Element => {
  const { ErrorBoundary } = useErrorBoundary()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [
    { connect, disconnect }, 
    { chainData, web3Provider, address }
  ] = useWeb3Connect(state, dispatch)
  const [{ onCreateCollection, onCreateToken, fetchOwnersCollections, fetchMarketCollections, onBuyToken, onListTokenForSale }, { marketContract, ownersCollections, marketCollections }] = useWeb3Contracts(state, dispatch)

  return (
    <ErrorBoundary>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "rgba(26,2,52,1)" }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "row" }}>
              <Typography sx={{ color: "#8c47d5" }} variant="h6" component="div" >
              NFT&nbsp;
              </Typography>
              <Typography variant="h6" component="div">
              Marketplace
              </Typography>
            </Box>
            {!!chainData && <NetworkInfo chainData={chainData} address={address}/>}
            {!!web3Provider && !chainData && (
              <Typography sx={{ color: "red", mr: 1 }} variant="caption" component="div" >
                Not supported chain
              </Typography>
            )}
            {web3Provider ? (
                <Button color="inherit" onClick={disconnect}>Disconnect</Button>
            ) : (
              <Button color="inherit" onClick={connect}>Connect</Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      {chainData && web3Provider && (
        <Container fixed sx={{ height: "80vh" }}>
          <Grid container sx={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
            <Grid item>
              <Marketplace 
                address={address}
                web3Provider={web3Provider}
                marketContract={marketContract}
                onCreateCollection={onCreateCollection} 
                onCreateToken={onCreateToken} 
                onBuyToken={onBuyToken} 
                onListTokenForSale={onListTokenForSale}
                fetchOwnersCollections={fetchOwnersCollections}
                fetchMarketCollections={fetchMarketCollections}
                ownersCollections={ownersCollections}
                marketCollections={marketCollections}
            />
            </Grid>
          </Grid>
        </Container>
      )}
    </ErrorBoundary>
  )
}

export default Home