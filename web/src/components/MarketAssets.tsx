import { useEffect, useState } from "react"
import { styled } from "@mui/material/styles"
import ListItem from "@mui/material/ListItem"
import List from "@mui/material/List"
import Button from "@mui/material/Button"
import ListItemText from "@mui/material/ListItemText"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import LinearProgress from "@mui/material/LinearProgress"

import MakeTokenOfferDialog from "./MakeTokenOfferDialog"
import { AssetType, AssetTokenType } from "../types"

const ListWrapper = styled("div")(() => ({
  backgroundColor: "transparent"
}))

const MarketAssets = ({
  marketAssets,
  onBuyToken,
  onMakeTokenOffer,
  loading,
}: {
  marketAssets: AssetType[]
  onBuyToken: (tokenId: string, price: number, collectionId: string) => void
  onMakeTokenOffer: (tokenId: string, price: string) => void
  loading: boolean
}): JSX.Element => {
  const [currentMarketCollection, setCurrentMarketCollection] = useState<AssetType | null>(null)
  const [currentToken, setCurrentToken] = useState<AssetTokenType | null>(null)
  const [openMakeAnOffer, setOpenMakeAnOffer] = useState(false)

  useEffect(() => {
    if (marketAssets?.length) {
      setCurrentMarketCollection(marketAssets[0])
    } else {
      setCurrentMarketCollection(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketAssets])

  const handleBuyToken = (token: AssetTokenType) => {
    setCurrentToken(token)
    onBuyToken(token.id, token.price, currentMarketCollection!.id)
  }

  const handleOpenMakeAnOffer = (token: AssetTokenType) => {
    setCurrentToken(token)
    setOpenMakeAnOffer(true)
  }

  return (
    <>
      {loading ? (
        <LinearProgress color="secondary" />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <ListWrapper>
              {!!marketAssets?.length && (
                <List
                  sx={{
                    borderRadius: 1,
                    border: "1px rgba(255,255,255,0.5) solid",
                    width: "100%",
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: "rgba(46,24,70,0.3)"
                  }}
                >
                  {marketAssets?.map((item) => (
                    <ListItem
                      sx={{
                        cursor: "pointer",
                        backgroundColor:
                          item.id === currentMarketCollection?.id
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(46,24,70,0.7)",
                        color:
                          item.id === currentMarketCollection?.id
                            ? "#000000"
                            : "#ffffff",
                      }}
                      key={item.id}
                    >
                      <ListItemText
                        primary={item.name}
                        onClick={() =>
                          setCurrentMarketCollection(
                            marketAssets.find(
                              ({ id }) => id === item.id,
                            ) || null
                          )
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </ListWrapper>
          </Grid>
          <Grid item xs={8}>
            {!!currentMarketCollection?.tokens?.length && (
              <Grid container spacing={1} alignItems="stretch">
                {currentMarketCollection.tokens.map((item: AssetTokenType) => (
                  <Grid key={item.id} height="240" xs={4} item>
                    <Card
                      sx={{
                        borderRadius: 1,
                        border: "1px rgba(255,255,255,0.5) solid",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(46,24,70,0.7)"
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.image}
                        alt={`${item.name} token`}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        {item?.forSale && (
                          <Button
                            size="small"
                            onClick={() => handleBuyToken(item)}
                          >
                            Buy
                          </Button>
                        )}
                        {item?.acceptOffers && (
                          <Button
                            size="small"
                            onClick={() => handleOpenMakeAnOffer(item)}
                          >
                            Make an Offer
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
      <MakeTokenOfferDialog
        openMakeAnOffer={openMakeAnOffer}
        onMakeTokenOffer={onMakeTokenOffer}
        onCloseMakeAnOffer={() => setOpenMakeAnOffer(false)}
        token={currentToken!}
      />
    </>
  )
}

export default MarketAssets
