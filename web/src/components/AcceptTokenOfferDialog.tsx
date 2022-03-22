import { useEffect, useState } from "react"
import { styled } from "@mui/material/styles"
import ListItem from "@mui/material/ListItem"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"

import BootstrapDialogTitle from "./BootstrapDialogTitle"
import { ellipseAddress } from "../helpers/utilities"
import { AssetTokenType, OfferType } from "../types"

const ListWrapper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}))

const AcceptTokenOfferDialog = ({
  token,
  openAcceptAnOffer,
  onAcceptTokenOffer,
  onCloseAcceptAnOffer,
  fetchTokenOffers,
}: {
  token: AssetTokenType
  openAcceptAnOffer: boolean
  onAcceptTokenOffer: (tokenId: string, offerId: number) => void
  onCloseAcceptAnOffer: () => void
  fetchTokenOffers: (tokenId: string) => Promise<OfferType[]>
}): JSX.Element => {
  const [currentOffer, setCurrentOffer] = useState<OfferType | null>(null)
  const [tokenOffers, setTokenOffers] = useState<OfferType[] | null>(null)

  useEffect(() => {
    const onFetchTokenOffers = async () => {
      setTokenOffers(await fetchTokenOffers(token.id))
    }

    if (openAcceptAnOffer) {
      onFetchTokenOffers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAcceptAnOffer])

  useEffect(() => {
    if (tokenOffers?.length) {
      setCurrentOffer(tokenOffers[0])
    } else {
      setCurrentOffer(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenOffers])

  const handleAcceptAnOffer = async () => {
    onCloseAcceptAnOffer()
    if (currentOffer) onAcceptTokenOffer(token.id, currentOffer.id)
  }

  return (
    <Dialog
      onClose={onCloseAcceptAnOffer}
      aria-labelledby="accept-an-offer-dialog-title"
      open={openAcceptAnOffer}
      sx={{ backgroundColor: "rgba(26,2,52,0.3)" }}
    >
      <BootstrapDialogTitle
        sx={{ backgroundColor: "rgba(26,2,52,0.7)" }}
        id="accept-an-offer-dialog-title"
        onClose={onCloseAcceptAnOffer}
      >
        Token {token?.name} Offers
      </BootstrapDialogTitle>
      <DialogContent
        dividers
        sx={{ backgroundColor: "rgba(26,2,52,0.7)", minWidth: 400 }}
      >
        <Grid item>
          <ListWrapper>
            {!!tokenOffers?.length && (
              <List
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  position: "relative",
                  backgroundColor: "#2e1846",
                }}
              >
                {tokenOffers?.map((item: any) => (
                  <ListItem
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        item.id === (currentOffer as any)?.id
                          ? "rgba(255,255,255,0.5)"
                          : "rgb(46,24,70)",
                      color:
                        item.id === (currentOffer as any)?.id
                          ? "#000000"
                          : "#ffffff",
                    }}
                    key={item.id}
                  >
                    <ListItemText
                      primary={`${ellipseAddress(item.offeror)} - ${item.price} eth`}
                      onClick={() =>
                        setCurrentOffer(
                          tokenOffers.find(
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
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "rgba(26,2,52,0.7)" }}>
        <Button
          disabled={!currentOffer}
          autoFocus
          onClick={handleAcceptAnOffer}
        >
          Accept an Offer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AcceptTokenOfferDialog
