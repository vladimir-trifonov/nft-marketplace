import { useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import BootstrapDialogTitle from './BootstrapDialogTitle'
import { pinJSONToIPFS } from '../services/ipfs'

const CreateTokenDialog = ({
  openCreateToken,
  onCreateToken,
  onCloseCreateToken,
  collection,
}: {
  openCreateToken: any
  onCreateToken: any
  onCloseCreateToken: any
  collection: any
}): JSX.Element => {
  const [tokenTitle, setTokenTitle] = useState('')
  const tokenTitleRef = useRef('')
  const [tokenDesc, setTokenDesc] = useState('')
  const tokenDescRef = useRef('')

  const handleCreateToken = async () => {
    onCloseCreateToken()
    const id = await pinJSONToIPFS({ name: tokenTitle, description: tokenDesc })

    setTokenTitle('')
    setTokenDesc('')

    if (id && collection)
      onCreateToken(id, (collection as any).id)
  }

  return (
    <Dialog
      onClose={onCloseCreateToken}
      aria-labelledby="create-token-dialog-title"
      open={openCreateToken}
      sx={{ backgroundColor: 'rgba(26,2,52,0.3)' }}
    >
      <BootstrapDialogTitle
        sx={{ backgroundColor: 'rgba(26,2,52,0.7)' }}
        id="create-token-dialog-title"
        onClose={onCloseCreateToken}
      >
        New Token
      </BootstrapDialogTitle>
      <DialogContent
        dividers
        sx={{ backgroundColor: 'rgba(26,2,52,0.7)', minWidth: 400, display: "flex", flexDirection: "column" }}
      >
        <TextField
          required
          value={tokenTitle}
          inputRef={tokenTitleRef}
          id="new-token-title-input"
          label="Title"
          variant="standard"
          onChange={() => {
            setTokenTitle((tokenTitleRef.current as any)?.value)
          }}
        />
        <TextField
          required
          value={tokenDesc}
          inputRef={tokenDescRef}
          id="new-token-desc-input"
          label="Description"
          variant="standard"
          onChange={() => {
            setTokenDesc((tokenDescRef.current as any)?.value)
          }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ backgroundColor: 'rgba(26,2,52,0.7)' }}>
        <Button
          disabled={tokenTitle === '' || tokenDesc === ''}
          autoFocus
          onClick={handleCreateToken}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateTokenDialog