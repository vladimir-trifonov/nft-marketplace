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
import CreateCollectionDialog from "./CreateCollectionDialog"
import CreateTokenDialog from "./CreateTokenDialog"
import AcceptTokenOfferDialog from "./AcceptTokenOfferDialog"
import LinearProgress from "@mui/material/LinearProgress"

const ListWrapper = styled("div")(() => ({
  backgroundColor: "transparent"
}))

const OwnerAssets = ({
  fetchTokenOffers,
  onListTokenForSale,
  onCreateCollection,
  onCreateToken,
  ownersAssets,
  onAcceptTokenOffer,
  loading,
}: {
  fetchTokenOffers: any
  onListTokenForSale: any
  onCreateCollection: any
  onCreateToken: any
  ownersAssets: any
  onAcceptTokenOffer: any
  loading: boolean
}): JSX.Element => {
  const [openCreateCollection, setOpenCreateCollection] = useState(false)
  const [currentCollection, setCurrentCollection] = useState(null)
  const [openCreateToken, setOpenCreateToken] = useState(false)
  const [openAcceptAnOffer, setOpenAcceptAnOffer] = useState(false)
  const [currentToken, setCurrentToken] = useState(null)

  useEffect(() => {
    if (ownersAssets?.length) {
      setCurrentCollection(ownersAssets[0])
    } else {
      setCurrentCollection(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownersAssets])

  const handleOpenCreateCollection = () => {
    setOpenCreateCollection(true)
  }

  const handleOpenCreateToken = () => {
    setOpenCreateToken(true)
  }
  
  const handleListTokenForSale = (token: any) => {
    setCurrentToken(token)
    onListTokenForSale(token.id)
  }
  
  const handleOpenAcceptAnOffer = (token: any) => {
    setCurrentToken(token)
    setOpenAcceptAnOffer(true)
  }

  return (
    <>
      {loading ? (
        <LinearProgress color="secondary" />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              size="medium"
              onClick={handleOpenCreateCollection}
            >
              Create Collection
            </Button>
            <ListWrapper sx={{ mt: 1 }}>
              {!!ownersAssets?.length && (
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
                  {ownersAssets?.map((item: any) => (
                    <ListItem
                      sx={{
                        cursor: "pointer",
                        backgroundColor:
                          item.id === (currentCollection as any)?.id
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(46,24,70,0.7)",
                        color:
                          item.id === (currentCollection as any)?.id
                            ? "#000000"
                            : "#ffffff",
                      }}
                      key={item.id}
                    >
                      <ListItemText
                        primary={item.name}
                        onClick={() =>
                          setCurrentCollection(
                            ownersAssets.find(
                              ({ id }: { id: string }) => id === item.id,
                            ),
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
            {(currentCollection as any)?.canCreateToken && (
              <Button
                sx={{ mb: 1 }}
                variant="outlined"
                size="medium"
                onClick={handleOpenCreateToken}
              >
                Create Token
              </Button>
            )}
            {!!(currentCollection as any)?.tokens?.length && (
              <Grid container spacing={1} alignItems="stretch">
                {(currentCollection as any).tokens.map((item: any) => (
                  <Grid
                    key={item.id}
                    minHeight="240"
                    maxHeight="240"
                    xs={4}
                    item
                  >
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
                        {item?.canSale && (
                          <Button
                            size="small"
                            onClick={() => handleListTokenForSale(item)}
                          >
                            List for sale
                          </Button>
                        )}
                        {item?.hasOffers && (
                          <Button size="small" onClick={() => handleOpenAcceptAnOffer(item)}>Accept an Offer</Button>
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
      <CreateCollectionDialog
        onCloseCreateCollection={() => setOpenCreateCollection(false)}
        onCreateCollection={onCreateCollection}
        openCreateCollection={openCreateCollection}
      />
      <CreateTokenDialog
        collection={currentCollection}
        openCreateToken={openCreateToken}
        onCreateToken={onCreateToken}
        onCloseCreateToken={() => setOpenCreateToken(false)}
      />
      <AcceptTokenOfferDialog
        fetchTokenOffers={fetchTokenOffers}
        token={currentToken}
        openAcceptAnOffer={openAcceptAnOffer}
        onAcceptTokenOffer={onAcceptTokenOffer}
        onCloseAcceptAnOffer={() => setOpenAcceptAnOffer(false)}
      />
    </>
  )
}

export default OwnerAssets
