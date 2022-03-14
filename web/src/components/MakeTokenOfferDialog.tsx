import { useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import BootstrapDialogTitle from './BootstrapDialogTitle'

const MakeTokenOfferDialog = ({
  openMakeAnOffer,
  onMakeTokenOffer,
  onCloseMakeAnOffer,
  token,
}: {
  openMakeAnOffer: any
  onMakeTokenOffer: any
  onCloseMakeAnOffer: any
  token: any
}): JSX.Element => {
  const [offerPrice, setOfferPrice] = useState('')
  const offerPriceRef = useRef('')

  const handleMakeAnOffer = async () => {
    onCloseMakeAnOffer()
    setOfferPrice('')
    onMakeTokenOffer(token.id, offerPrice)
  }

  return (
    <Dialog
      onClose={onCloseMakeAnOffer}
      aria-labelledby="make-token-offer-dialog-title"
      open={openMakeAnOffer}
      sx={{ backgroundColor: 'rgba(26,2,52,0.3)' }}
    >
      <BootstrapDialogTitle
        sx={{ backgroundColor: 'rgba(26,2,52,0.7)' }}
        id="make-token-offer-dialog-title"
        onClose={onCloseMakeAnOffer}
      >
        New Offer
      </BootstrapDialogTitle>
      <DialogContent
        dividers
        sx={{ backgroundColor: 'rgba(26,2,52,0.7)', minWidth: 400 }}
      >
        <TextField
          required
          value={offerPrice}
          inputRef={offerPriceRef}
          id="new-offer-price-input"
          label="Price"
          variant="standard"
          onChange={() => {
            setOfferPrice((offerPriceRef.current as any)?.value)
          }}
        />
      </DialogContent>
      <DialogActions sx={{ backgroundColor: 'rgba(26,2,52,0.7)' }}>
        <Button
          disabled={offerPrice === ''}
          autoFocus
          onClick={handleMakeAnOffer}
        >
          Make an Offer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MakeTokenOfferDialog
