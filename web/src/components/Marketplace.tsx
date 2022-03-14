import { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import MarketCollections from './MarketCollections'
import OwnerCollections from './OwnerCollections'

const Marketplace = ({
  address,
  marketCollections,
  onBuyToken,
  onListTokenForSale,
  fetchMarketCollections,
  onCreateCollection,
  web3Provider,
  onCreateToken,
  fetchOwnersCollections,
  ownersCollections,
  marketContract,
  onMakeTokenOffer,
  onAcceptTokenOffer,
  marketCollectionsLoading,
  ownersCollectionsLoading,
  fetchTokenOffers
}: {
  address: string
  onBuyToken: any
  onListTokenForSale: any
  marketCollections: any
  fetchMarketCollections: any
  web3Provider: any
  marketContract: any
  onCreateCollection: any
  onCreateToken: any
  fetchOwnersCollections: any
  ownersCollections: any
  onMakeTokenOffer: any
  onAcceptTokenOffer: any
  marketCollectionsLoading: boolean
  ownersCollectionsLoading: boolean
  fetchTokenOffers: any
}): JSX.Element => {
  const [tab, setTab] = useState('market')

  useEffect(() => {
    if (marketContract && web3Provider && address && !!tab) {
      if (tab === 'collections') {
        fetchOwnersCollections()
      } else {
        fetchMarketCollections()
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
        sx={{ p: 1.5, backgroundColor: 'rgba(26,2,52,0.8)' }}
      >
        <Box
          sx={{
            typography: 'body1',
            minWidth: 1100,
            minHeight: 700,
          }}
        >
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeTab} aria-label="marketplace tabs">
                <Tab label="Explore Market" value="market" />
                <Tab label="My Collections" value="collections" />
              </TabList>
            </Box>
            <TabPanel value="market">
              <MarketCollections
                marketCollections={marketCollections}
                onBuyToken={onBuyToken}
                onMakeTokenOffer={onMakeTokenOffer}
                loading={marketCollectionsLoading}
              />
            </TabPanel>
            <TabPanel value="collections">
              <OwnerCollections
                fetchTokenOffers={fetchTokenOffers}
                onListTokenForSale={onListTokenForSale}
                onCreateCollection={onCreateCollection}
                onCreateToken={onCreateToken}
                ownersCollections={ownersCollections}
                onAcceptTokenOffer={onAcceptTokenOffer}
                loading={ownersCollectionsLoading}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Paper>
    </>
  )
}

export default Marketplace
