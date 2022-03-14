import { useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import BootstrapDialogTitle from './BootstrapDialogTitle'
import { pinJSONToIPFS } from '../services/ipfs'

const CreateCollectionDialog = ({
  onCloseCreateCollection,
  onCreateCollection,
  openCreateCollection,
}: {
  onCloseCreateCollection: any
  onCreateCollection: any
  openCreateCollection: any
}): JSX.Element => {
  const [collectionTitle, setCollectionTitle] = useState('')
  const collectionTitleRef = useRef('')

  const handleCreateCollection = async () => {
    onCloseCreateCollection()
    const id = await pinJSONToIPFS({ name: collectionTitle })
    setCollectionTitle('')
    if (id) onCreateCollection(id)
  }

  return (
    <Dialog
      onClose={onCloseCreateCollection}
      aria-labelledby="create-collection-dialog-title"
      open={openCreateCollection}
      sx={{ backgroundColor: 'rgba(26,2,52,0.3)' }}
    >
      <BootstrapDialogTitle
        sx={{ backgroundColor: 'rgba(26,2,52,0.7)' }}
        id="create-collection-dialog-title"
        onClose={onCloseCreateCollection}
      >
        New Collection
      </BootstrapDialogTitle>
      <DialogContent
        dividers
        sx={{ backgroundColor: 'rgba(26,2,52,0.7)', minWidth: 400 }}
      >
        <TextField
          required
          value={collectionTitle}
          inputRef={collectionTitleRef}
          id="new-collection-title-input"
          label="Title"
          variant="standard"
          onChange={() => {
            setCollectionTitle((collectionTitleRef.current as any)?.value)
          }}
        />
      </DialogContent>
      <DialogActions sx={{ backgroundColor: 'rgba(26,2,52,0.7)' }}>
        <Button
          disabled={collectionTitle === ''}
          autoFocus
          onClick={handleCreateCollection}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateCollectionDialog
