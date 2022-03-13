import { useEffect, useRef, useState } from "react";
import { styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper"
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { pinJSONToIPFS } from "../services/ipfs"

const ListWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const BootstrapDialogTitle = (props: any) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const Marketplace = (
  { address, marketCollections, onBuyToken, onListTokenForSale, fetchMarketCollections, onCreateCollection, web3Provider, onCreateToken, fetchOwnersCollections, ownersCollections, marketContract }:
    { address: string, onBuyToken: any, onListTokenForSale: any, marketCollections: any, fetchMarketCollections: any, web3Provider: any, marketContract: any, onCreateCollection: any, onCreateToken: any, fetchOwnersCollections: any, ownersCollections: any }): JSX.Element => {
  const [tab, setTab] = useState('market');
  const [openCreateCollection, setOpenCreateCollection] = useState(false);
  const [currentOwnerCollection, setCurrentOwnerCollection] = useState(null);
  const [currentMarketCollection, setCurrentMarketCollection] = useState(null);
  const [openCreateToken, setOpenCreateToken] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState("")
  const collectionTitleRef = useRef("")
  const [tokenTitle, setTokenTitle] = useState("")
  const tokenTitleRef = useRef("")

  useEffect(() => {
    if (ownersCollections.length) {
      setCurrentOwnerCollection(ownersCollections[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownersCollections])

  useEffect(() => {
    if (marketCollections.length) {
      setCurrentMarketCollection(marketCollections[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketCollections])

  useEffect(() => {
    if (marketContract && web3Provider && address && !!tab) {
      if (tab === "collections") {
        setCurrentOwnerCollection(null)
        fetchOwnersCollections()

      } else {
        setCurrentMarketCollection(null)
        fetchMarketCollections()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketContract, web3Provider, address, tab])

  const handleChangeTab = (event: any, newValue: string) => {
    setTab(newValue);
  };

  const handleOpenCreateCollection = () => {
    setOpenCreateCollection(true);
  };
  const handleCloseCreateCollection = () => {
    setOpenCreateCollection(false);
  };

  const handleOpenCreateToken = () => {
    setOpenCreateToken(true);
  };
  const handleCloseCreateToken = () => {
    setOpenCreateToken(false);
  };

  const handleBuyToken = (id: string) => {
    onBuyToken(id, (currentMarketCollection as any).id);
  };

  const handleListTokenForSale = (id: string) => {
    onListTokenForSale(id);
  };

  const handleCreateToken = async () => {
    handleCloseCreateToken();
    const id = await pinJSONToIPFS({ name: tokenTitle });
    setTokenTitle("");
    if (id && currentOwnerCollection) onCreateToken(id, (currentOwnerCollection as any).id);
  }

  const handleCreateCollection = async () => {
    handleCloseCreateCollection();
    const id = await pinJSONToIPFS({ name: collectionTitle });
    setCollectionTitle("");
    if (id) onCreateCollection(id);
  }

  return (
    <>
      <Paper elevation={0} sx={{ p: 1.5, backgroundColor: 'rgba(26,2,52,0.8)' }}>
        <Box sx={{ width: '100%', typography: 'body1', minWidth: 1200, minHeight: 640 }}>
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeTab} aria-label="marketplace tabs">
                <Tab label="Explore Market" value="market" />
                <Tab label="My Collections" value="collections" />
              </TabList>
            </Box>
            <TabPanel value="market">
              <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                  <ListWrapper>
                    {!!marketCollections?.length && (
                      <List
                        sx={{
                          width: '100%',
                          position: 'relative',
                          overflow: 'auto',
                          maxHeight: 300,
                          mt: 1
                        }}
                      >
                        {marketCollections.map((item: any) => (
                          <ListItem key={item.id}>
                            <ListItemText primary={item.name} onClick={() => setCurrentMarketCollection(marketCollections.find(({ id }: { id: string }) => id === item.id))} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </ListWrapper>
                </Grid>
                <Grid item>
                  {!!(currentMarketCollection as any)?.tokens?.length && (
                    <Grid container spacing={1} alignItems="stretch">
                      {(currentMarketCollection as any).tokens.map((item: any) => (
                        <Grid key={item.id} xs bgcolor="#121212" item onClick={() => handleBuyToken(item.id)}>
                          <Typography variant="h6" component="div">
                            {item.name}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="collections">
              <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                  <Button variant="outlined" size="medium" onClick={handleOpenCreateCollection}>
                    Create Collection
                  </Button>
                  {currentOwnerCollection && (
                    <Button sx={{ ml: 1 }} variant="outlined" size="medium" onClick={handleOpenCreateToken}>
                      Create Token
                    </Button>
                  )}
                  <ListWrapper>
                    {!!ownersCollections?.length && (
                      <List
                        sx={{
                          width: '100%',
                          position: 'relative',
                          overflow: 'auto',
                          maxHeight: 300,
                          mt: 1
                        }}
                      >
                        {ownersCollections.map((item: any) => (
                          <ListItem key={item.id}>
                            <ListItemText primary={item.name} onClick={() => setCurrentOwnerCollection(ownersCollections.find(({ id }: { id: string }) => id === item.id))} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </ListWrapper>
                </Grid>
                <Grid item>
                  {!!(currentOwnerCollection as any)?.tokens?.length && (
                    <Grid container spacing={1} alignItems="stretch">
                      {(currentOwnerCollection as any).tokens.map((item: any) => (
                        <Grid key={item.id} xs bgcolor="#121212" item onClick={() => handleListTokenForSale(item.id)}>
                          <Typography variant="h6" component="div">
                            {item.name}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </TabPanel>
          </TabContext>
        </Box>
      </Paper>
      <Dialog
        onClose={handleCloseCreateCollection}
        aria-labelledby="create-collection-dialog-title"
        open={openCreateCollection}
        sx={{ backgroundColor: 'rgba(26,2,52,1)' }}
      >
        <BootstrapDialogTitle sx={{ backgroundColor: 'rgba(26,2,52,1)' }} id="create-collection-dialog-title" onClose={handleCloseCreateCollection}>
          New Collection
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ backgroundColor: 'rgba(26,2,52,1)', minWidth: 400 }}>
          <TextField required
            value={collectionTitle}
            inputRef={collectionTitleRef} id="new-collection-title-input" label="Title" variant="standard" onChange={() => { setCollectionTitle((collectionTitleRef.current as any)?.value) }} />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: 'rgba(26,2,52,1)' }}>
          <Button disabled={collectionTitle === ""} autoFocus onClick={handleCreateCollection}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseCreateToken}
        aria-labelledby="create-token-dialog-title"
        open={openCreateToken}
        sx={{ backgroundColor: 'rgba(26,2,52,1)' }}
      >
        <BootstrapDialogTitle sx={{ backgroundColor: 'rgba(26,2,52,1)' }} id="create-token-dialog-title" onClose={handleCloseCreateToken}>
          New Token
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ backgroundColor: 'rgba(26,2,52,1)', minWidth: 400 }}>
          <TextField required
            value={tokenTitle}
            inputRef={tokenTitleRef} id="new-token-title-input" label="Title" variant="standard" onChange={() => { setTokenTitle((tokenTitleRef.current as any)?.value) }} />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: 'rgba(26,2,52,1)' }}>
          <Button disabled={tokenTitle === ""} autoFocus onClick={handleCreateToken}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Marketplace