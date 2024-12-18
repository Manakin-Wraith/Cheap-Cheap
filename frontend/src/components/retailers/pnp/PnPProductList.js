import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Container,
  Typography,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Chip,
  Paper,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductCard from '../../common/ProductCard';
import ShoppingList from '../../common/ShoppingList';
import {
  getAllLists,
  createNewList,
  updateList,
  getListById
} from '../../../utils/listManager';

// Predefined categories for PnP products
const PRODUCT_CATEGORIES = {
  'Groceries': ['Pantry', 'Canned Goods', 'Baking', 'Condiments'],
  'Fresh Food': ['Fruits', 'Vegetables', 'Meat', 'Dairy', 'Bakery'],
  'Beverages': ['Soft Drinks', 'Coffee', 'Tea', 'Juices', 'Water'],
  'Household': ['Cleaning', 'Laundry', 'Paper Products', 'Pet Supplies'],
  'Personal Care': ['Health', 'Beauty', 'Baby Care'],
  'Frozen Foods': ['Frozen Meals', 'Ice Cream', 'Frozen Vegetables'],
  'Snacks': ['Chips', 'Cookies', 'Candy', 'Nuts'],
  'Other': ['Miscellaneous']
};

const PnPProductList = ({ activeListId, onListChange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedMainCategory, setSelectedMainCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [availableCategories, setAvailableCategories] = useState(new Set());
  const [currentList, setCurrentList] = useState(null);
  const [saveListDialog, setSaveListDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [existingLists, setExistingLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [activeListName, setActiveListName] = useState('');

  useEffect(() => {
    fetchProducts();
    if (activeListId) {
      loadListById(activeListId);
    } else {
      loadSavedList();
      setActiveListName('');
    }
  }, [activeListId]);

  useEffect(() => {
    if (products.length > 0) {
      // Extract unique categories from products
      const categories = new Set(products.map(product => 
        categorizeProduct(product['product-grid-item__info-container__name'])
      ));
      setAvailableCategories(categories);
    }
  }, [products]);

  useEffect(() => {
    if (saveListDialog) {
      loadExistingLists();
    }
  }, [saveListDialog]);

  const categorizeProduct = (productName) => {
    productName = productName.toLowerCase();
    
    // Define category keywords and their corresponding categories
    const categoryKeywords = {
      'milk': 'Fresh Food/Dairy',
      'bread': 'Fresh Food/Bakery',
      'juice': 'Beverages/Juices',
      'coffee': 'Beverages/Coffee',
      'tea': 'Beverages/Tea',
      'water': 'Beverages/Water',
      'soda': 'Beverages/Soft Drinks',
      'coca-cola': 'Beverages/Soft Drinks',
      'pepsi': 'Beverages/Soft Drinks',
      'meat': 'Fresh Food/Meat',
      'chicken': 'Fresh Food/Meat',
      'beef': 'Fresh Food/Meat',
      'pork': 'Fresh Food/Meat',
      'fish': 'Fresh Food/Meat',
      'fruit': 'Fresh Food/Fruits',
      'apple': 'Fresh Food/Fruits',
      'banana': 'Fresh Food/Fruits',
      'vegetable': 'Fresh Food/Vegetables',
      'potato': 'Fresh Food/Vegetables',
      'tomato': 'Fresh Food/Vegetables',
      'cleaning': 'Household/Cleaning',
      'detergent': 'Household/Cleaning',
      'soap': 'Household/Cleaning',
      'paper': 'Household/Paper Products',
      'toilet': 'Household/Paper Products',
      'tissue': 'Household/Paper Products',
      'pet': 'Household/Pet Supplies',
      'dog': 'Household/Pet Supplies',
      'cat': 'Household/Pet Supplies',
      'frozen': 'Frozen Foods/Frozen Meals',
      'ice cream': 'Frozen Foods/Ice Cream',
      'chips': 'Snacks/Chips',
      'chocolate': 'Snacks/Candy',
      'candy': 'Snacks/Candy',
      'cookies': 'Snacks/Cookies',
      'biscuit': 'Snacks/Cookies',
      'health': 'Personal Care/Health',
      'beauty': 'Personal Care/Beauty',
      'baby': 'Personal Care/Baby Care',
      'diaper': 'Personal Care/Baby Care'
    };

    // Find matching category based on product name
    for (const [keyword, category] of Object.entries(categoryKeywords)) {
      if (productName.includes(keyword)) {
        return category;
      }
    }

    return 'Other/Miscellaneous';
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/promotions');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      // Add categories to products
      const categorizedData = data.map(product => ({
        ...product,
        category: categorizeProduct(product['product-grid-item__info-container__name'])
      }));
      setProducts(categorizedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const loadExistingLists = () => {
    const lists = getAllLists();
    setExistingLists(lists);
  };

  const loadSavedList = () => {
    const savedList = localStorage.getItem('pnp-shopping-list');
    if (savedList) {
      try {
        setShoppingList(JSON.parse(savedList));
        showSnackbar('Shopping list loaded', 'success');
      } catch (err) {
        showSnackbar('Failed to load shopping list', 'error');
      }
    }
  };

  const loadListById = (listId) => {
    const list = getListById(listId);
    if (list) {
      setShoppingList(list.items);
      setActiveListName(list.name);
      setSnackbar({
        open: true,
        message: `Loaded list: ${list.name}`,
        severity: 'success'
      });
    }
  };

  const handleAddToList = (product) => {
    const productToAdd = {
      id: product['product-grid-item__info-container__name'],
      title: product['product-grid-item__info-container__name'],
      currentPrice: product.price,
      quantity: 1,
      category: product.category,
      originalProduct: product
    };

    if (!shoppingList.some(item => item.id === productToAdd.id)) {
      setShoppingList(prevList => [...prevList, productToAdd]);
      showSnackbar('Item added to list', 'success');
    }
  };

  const handleRemoveFromList = (productToRemove) => {
    setShoppingList(prevList => 
      prevList.filter(item => item.id !== productToRemove.id)
    );
    showSnackbar('Item removed from list', 'info');
  };

  const handleUpdateQuantity = (item, change) => {
    setShoppingList(prevList =>
      prevList.map(listItem =>
        listItem.id === item.id
          ? { ...listItem, quantity: Math.max(1, (listItem.quantity || 1) + change) }
          : listItem
      )
    );
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear the list?')) {
      setShoppingList([]);
      onListChange(null); // Clear active list
      setActiveListName('');
      setSnackbar({
        open: true,
        message: 'Shopping list cleared',
        severity: 'success'
      });
    }
  };

  const handleSaveList = () => {
    try {
      localStorage.setItem('pnp-shopping-list', JSON.stringify(shoppingList));
      showSnackbar('Shopping list saved', 'success');
    } catch (err) {
      showSnackbar('Failed to save shopping list', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMainCategoryChange = (event) => {
    setSelectedMainCategory(event.target.value);
    setSelectedSubCategory('All');
  };

  const handleSubCategoryChange = (event) => {
    setSelectedSubCategory(event.target.value);
  };

  const getSubCategories = () => {
    if (selectedMainCategory === 'All') return ['All'];
    return ['All', ...PRODUCT_CATEGORIES[selectedMainCategory] || []];
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product['product-grid-item__info-container__name']
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const [mainCat, subCat] = product.category?.split('/') || ['Other', 'Miscellaneous'];
    const matchesCategory = 
      (selectedMainCategory === 'All' || mainCat === selectedMainCategory) &&
      (selectedSubCategory === 'All' || subCat === selectedSubCategory);

    return matchesSearch && matchesCategory;
  });

  const handleSaveToNewList = () => {
    if (!newListName.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a list name',
        severity: 'error'
      });
      return;
    }

    const newList = createNewList(newListName.trim(), shoppingList);
    setCurrentList(newList);
    onListChange(newList.id); // Set as active list
    setActiveListName(newListName.trim());
    setSaveListDialog(false);
    setNewListName('');
    loadExistingLists();
    setSnackbar({
      open: true,
      message: 'List saved successfully',
      severity: 'success'
    });
  };

  const handleSaveToExistingList = () => {
    if (!selectedListId) {
      setSnackbar({
        open: true,
        message: 'Please select a list',
        severity: 'error'
      });
      return;
    }

    const list = getListById(selectedListId);
    if (list) {
      const updatedItems = [...list.items, ...shoppingList];
      const updatedList = updateList(selectedListId, { items: updatedItems });
      if (updatedList) {
        setCurrentList(updatedList);
        onListChange(updatedList.id); // Set as active list
        setSaveListDialog(false);
        setSelectedListId('');
        loadExistingLists();
        setSnackbar({
          open: true,
          message: 'Items added to list successfully',
          severity: 'success'
        });
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Stack spacing={2}>
                {/* Search Bar */}
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setSearchTerm('')} size="small">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {/* Category Filters */}
                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Main Category</InputLabel>
                    <Select
                      value={selectedMainCategory}
                      onChange={handleMainCategoryChange}
                      label="Main Category"
                      startAdornment={
                        <InputAdornment position="start">
                          <FilterListIcon />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="All">All Categories</MenuItem>
                      {Object.keys(PRODUCT_CATEGORIES).map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Sub Category</InputLabel>
                    <Select
                      value={selectedSubCategory}
                      onChange={handleSubCategoryChange}
                      label="Sub Category"
                      disabled={selectedMainCategory === 'All'}
                    >
                      {getSubCategories().map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                {/* Active Filters Display */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedMainCategory !== 'All' && (
                    <Chip
                      label={selectedMainCategory}
                      onDelete={() => setSelectedMainCategory('All')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {selectedSubCategory !== 'All' && (
                    <Chip
                      label={selectedSubCategory}
                      onDelete={() => setSelectedSubCategory('All')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Stack>
            </Paper>

            <Grid container spacing={3}>
              {filteredProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ProductCard
                    title={product['product-grid-item__info-container__name']}
                    currentPrice={product.price}
                    oldPrice={product.old}
                    imageUrl={product.src}
                    promotion={product['ng-star-inserted']}
                    retailer="Pick n Pay"
                    additionalInfo={{
                      Category: product.category || 'N/A'
                    }}
                    onAddToList={() => handleAddToList(product)}
                    isInList={shoppingList.some(
                      item => item.id === product['product-grid-item__info-container__name']
                    )}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              position: { md: 'sticky' }, 
              top: 24,
              height: { md: 'calc(100vh - 48px)' },
              overflow: 'hidden',
              display: 'flex'
            }}>
              <ShoppingList
                items={shoppingList}
                onRemoveItem={handleRemoveFromList}
                onUpdateQuantity={handleUpdateQuantity}
                onClearAll={handleClearAll}
                onSaveList={() => setSaveListDialog(true)}
                retailer="Pick n Pay"
                activeListName={activeListName}
              />
            </Box>
          </Grid>
        </Grid>
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
      <Dialog
        open={saveListDialog}
        onClose={() => {
          setSaveListDialog(false);
          setNewListName('');
          setSelectedListId('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SaveIcon color="primary" />
            <Typography variant="h6">Save Shopping List</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Create New List
              </Typography>
              <TextField
                label="New List Name"
                fullWidth
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter a name for your new list"
                variant="outlined"
              />
            </Box>
            
            <Divider>OR</Divider>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Add to Existing List
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Select List</InputLabel>
                <Select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  label="Select List"
                >
                  <MenuItem value="">
                    <em>Select a list</em>
                  </MenuItem>
                  {existingLists.map((list) => (
                    <MenuItem key={list.id} value={list.id}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                        <ShoppingCartIcon fontSize="small" color="action" />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1">{list.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {list.items.length} items • Last updated: {new Date(list.updatedAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => {
              setSaveListDialog(false);
              setNewListName('');
              setSelectedListId('');
            }}
          >
            Cancel
          </Button>
          {selectedListId ? (
            <Button 
              onClick={handleSaveToExistingList} 
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!selectedListId}
            >
              Add to Selected List
            </Button>
          ) : (
            <Button 
              onClick={handleSaveToNewList} 
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!newListName.trim()}
            >
              Create New List
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PnPProductList;
