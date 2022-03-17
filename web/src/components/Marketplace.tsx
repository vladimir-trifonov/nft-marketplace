import { useEffect, useState } from "react"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import MarketAssets from "./MarketAssets"
import OwnerAssets from "./OwnerAssets"

const Marketplace = ({
  address,
  marketAssets,
  onBuyToken,
  onListTokenForSale,
  fetchMarketAssets,
  onCreateCollection,
  web3Provider,
  onCreateToken,
  fetchOwnersAssets,
  ownersAssets,
  marketContract,
  collectionContract,
  nftContract,
  onMakeTokenOffer,
  onAcceptTokenOffer,
  marketAssetsLoading,
  ownersAssetsLoading,
  fetchTokenOffers
}: {
  address: string
  onBuyToken: any
  onListTokenForSale: any
  marketAssets: any
  fetchMarketAssets: any
  web3Provider: any
  marketContract: any
  collectionContract: any
  nftContract: any
  onCreateCollection: any
  onCreateToken: any
  fetchOwnersAssets: any
  ownersAssets: any
  onMakeTokenOffer: any
  onAcceptTokenOffer: any
  marketAssetsLoading: boolean
  ownersAssetsLoading: boolean
  fetchTokenOffers: any
}): JSX.Element => {
  const [tab, setTab] = useState("market")

  useEffect(() => {
    if (nftContract && collectionContract && marketContract && web3Provider && address && !!tab) {
      if (tab === "collections") {
        fetchOwnersAssets()
      } else {
        fetchMarketAssets()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketContract, web3Provider, address, tab])

  const handleChangeTab = (_: any, newValue: string) => {
    setTab(newValue)
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{ p: 1.5, backgroundColor: "rgba(26,2,52,0.8)" }}
      >
        <Box
          sx={{
            typography: "body1",
            minWidth: 1100,
            minHeight: 500,
          }}
        >
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChangeTab} aria-label="marketplace tabs">
                <Tab label="Explore Market" value="market" />
                <Tab label="My Assets" value="collections" />
              </TabList>
            </Box>
            <TabPanel value="market">
              <MarketAssets
                marketAssets={marketAssets}
                onBuyToken={onBuyToken}
                onMakeTokenOffer={onMakeTokenOffer}
                loading={marketAssetsLoading}
              />
            </TabPanel>
            <TabPanel value="collections">
              <OwnerAssets
                fetchTokenOffers={fetchTokenOffers}
                onListTokenForSale={onListTokenForSale}
                onCreateCollection={onCreateCollection}
                onCreateToken={onCreateToken}
                ownersAssets={ownersAssets}
                onAcceptTokenOffer={onAcceptTokenOffer}
                loading={ownersAssetsLoading}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Paper>
    </>
  )
}

export default Marketplace
