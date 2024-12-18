import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  Stack,
  TextField,
  Menu,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  getAllLists,
  createNewList,
  updateList,
  deleteList,
  duplicateList,
  calculateTotalPrice,
  calculateTotalSavings
} from '../../utils/listManager';

const SavedLists = ({ onSelectList, activeListId }) => {
  const [savedLists, setSavedLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [createDialog, setCreateDialog] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    loadSavedLists();
  }, []);

  const loadSavedLists = () => {
    const lists = getAllLists();
    setSavedLists(lists);
  };

  const handleCreateList = () => {
    if (!newListName.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a list name',
        severity: 'error'
      });
      return;
    }

    createNewList(newListName.trim(), []);
    loadSavedLists();
    setCreateDialog(false);
    setNewListName('');
    setSnackbar({
      open: true,
      message: 'New list created successfully',
      severity: 'success'
    });
  };

  const handleDeleteList = (listId) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      deleteList(listId);
      loadSavedLists();
      setSnackbar({
        open: true,
        message: 'List deleted successfully',
        severity: 'success'
      });
    }
  };

  const handleDuplicateList = (listId) => {
    const newList = duplicateList(listId);
    if (newList) {
      loadSavedLists();
      setSnackbar({
        open: true,
        message: 'List duplicated successfully',
        severity: 'success'
      });
    }
  };

  const handleEditList = (list) => {
    setSelectedList(list);
    setEditName(list.name);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      setSnackbar({
        open: true,
        message: 'List name cannot be empty',
        severity: 'error'
      });
      return;
    }

    const updatedList = updateList(selectedList.id, { name: editName.trim() });
    if (updatedList) {
      loadSavedLists();
      setOpenDialog(false);
      setEditMode(false);
      setSnackbar({
        open: true,
        message: 'List updated successfully',
        severity: 'success'
      });
    }
  };

  const handleViewList = (list) => {
    setSelectedList(list);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedList(null);
    setEditMode(false);
    setEditName('');
  };

  const handleMenuOpen = (event, list) => {
    setSelectedList(list);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenList = (listId) => {
    onSelectList(listId);
    setSnackbar({
      open: true,
      message: 'List opened in shopping view',
      severity: 'success'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Saved Shopping Lists
        </Typography>
        <Button
          variant="contained"
          onClick={() => setCreateDialog(true)}
          startIcon={<ShoppingCartIcon />}
        >
          Create New List
        </Button>
      </Stack>

      {savedLists.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          No saved shopping lists found. Create a new list to get started.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {savedLists.map((list) => (
            <Grid item xs={12} sm={6} md={4} key={list.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  border: list.id === activeListId ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ShoppingCartIcon color="primary" />
                      <Typography variant="h6" component="div">
                        {list.name}
                      </Typography>
                    </Stack>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleMenuOpen(e, list)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(list.createdAt).toLocaleDateString()}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {list.items.length} items
                  </Typography>
                  
                  <Typography variant="h6" color="primary" gutterBottom>
                    Total: R{calculateTotalPrice(list.items).toFixed(2)}
                  </Typography>
                  
                  {calculateTotalSavings(list.items) > 0 && (
                    <Typography variant="body2" color="success.main">
                      Savings: R{calculateTotalSavings(list.items).toFixed(2)}
                    </Typography>
                  )}
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => handleViewList(list)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create New List Dialog */}
      <Dialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Shopping List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Name"
            fullWidth
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateList} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* View/Edit List Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedList && (
          <>
            <DialogTitle>
              {editMode ? (
                <TextField
                  fullWidth
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  variant="standard"
                />
              ) : (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ShoppingCartIcon color="primary" />
                  <Typography variant="h6">
                    {selectedList.name}
                  </Typography>
                </Stack>
              )}
            </DialogTitle>
            <DialogContent dividers>
              {selectedList.items.length === 0 ? (
                <Typography color="text.secondary" align="center" py={2}>
                  This list is empty. Add items from the promotions page.
                </Typography>
              ) : (
                <List>
                  {selectedList.items.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={item.title}
                          secondary={
                            <Stack spacing={1}>
                              <Typography variant="body2">
                                Price: {item.currentPrice} x {item.quantity}
                              </Typography>
                              {item.originalProduct.old && (
                                <Typography variant="body2" color="success.main">
                                  Savings: R{((parseFloat(item.originalProduct.old.replace('R', '')) - 
                                            parseFloat(item.currentPrice.replace('R', ''))) * 
                                            item.quantity).toFixed(2)}
                                </Typography>
                              )}
                            </Stack>
                          }
                        />
                      </ListItem>
                      {index < selectedList.items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              {editMode ? (
                <>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button onClick={handleSaveEdit} variant="contained">Save</Button>
                </>
              ) : (
                <Button onClick={handleCloseDialog}>Close</Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* List Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          handleOpenList(selectedList.id);
        }}>
          <ListItemText primary="Open List" />
          <ShoppingCartIcon fontSize="small" sx={{ ml: 1 }} />
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          handleEditList(selectedList);
        }}>
          <ListItemText primary="Rename" />
          <EditIcon fontSize="small" sx={{ ml: 1 }} />
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          handleDuplicateList(selectedList.id);
        }}>
          <ListItemText primary="Duplicate" />
          <ContentCopyIcon fontSize="small" sx={{ ml: 1 }} />
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          handleDeleteList(selectedList.id);
        }}>
          <ListItemText primary="Delete" />
          <DeleteIcon fontSize="small" sx={{ ml: 1 }} color="error" />
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SavedLists;
