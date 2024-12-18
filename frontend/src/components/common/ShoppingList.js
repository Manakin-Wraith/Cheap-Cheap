import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Stack,
  Paper,
  Tooltip,
  Fade,
  Badge,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';

const ShoppingList = ({ 
  items, 
  onRemoveItem, 
  onUpdateQuantity, 
  onClearAll, 
  onSaveList, 
  retailer,
  activeListName 
}) => {
  const theme = useTheme();

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.currentPrice.replace('R', '')) * item.quantity);
    }, 0);
  };

  const calculateTotalSavings = () => {
    return items.reduce((total, item) => {
      const currentPrice = parseFloat(item.currentPrice.replace('R', ''));
      const oldPrice = item.originalProduct.old 
        ? parseFloat(item.originalProduct.old.replace('R', ''))
        : currentPrice;
      const savings = (oldPrice - currentPrice) * item.quantity;
      return total + (savings > 0 ? savings : 0);
    }, 0);
  };

  const calculateSavingsPercentage = () => {
    const totalSavings = calculateTotalSavings();
    const totalOriginalPrice = items.reduce((total, item) => {
      const currentPrice = parseFloat(item.currentPrice.replace('R', ''));
      const oldPrice = item.originalProduct.old 
        ? parseFloat(item.originalProduct.old.replace('R', ''))
        : currentPrice;
      return total + (oldPrice * item.quantity);
    }, 0);
    
    return totalOriginalPrice > 0 
      ? ((totalSavings / totalOriginalPrice) * 100).toFixed(1)
      : 0;
  };

  const handleExport = () => {
    const content = `${retailer} Shopping List\n` +
      `Generated on ${new Date().toLocaleDateString()}\n\n` +
      items.map(item => 
        `${item.title}\n` +
        `  Price: ${item.currentPrice} x ${item.quantity}\n` +
        `  Category: ${item.category || 'N/A'}\n` +
        (item.originalProduct.old ? `  Savings: R${((parseFloat(item.originalProduct.old.replace('R', '')) - parseFloat(item.currentPrice.replace('R', ''))) * item.quantity).toFixed(2)}\n` : '')
      ).join('\n') +
      `\nTotal Items: ${items.length}\n` +
      `Total Price: R${calculateTotalPrice().toFixed(2)}\n` +
      `Total Savings: R${calculateTotalSavings().toFixed(2)} (${calculateSavingsPercentage()}%)\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${retailer.toLowerCase()}-shopping-list.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }} 
      onWheel={(e) => {
        e.stopPropagation();
      }}
    >
      {/* Header Section - Fixed */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Badge badgeContent={items.length} color="primary" sx={{ mr: 2 }}>
            <ShoppingCartIcon color="primary" sx={{ fontSize: 28 }} />
          </Badge>
          <Typography variant="h5" component="h2" fontWeight="bold">
            {activeListName || 'Shopping List'}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Save List" TransitionComponent={Fade} arrow>
                <IconButton 
                  onClick={onSaveList} 
                  sx={{ 
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.primary.main, 0.1) 
                    }
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export List" TransitionComponent={Fade} arrow>
                <IconButton 
                  onClick={handleExport}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.primary.main, 0.1) 
                    }
                  }}
                >
                  <FileDownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear All" TransitionComponent={Fade} arrow>
                <IconButton 
                  onClick={onClearAll}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.error.main, 0.1) 
                    }
                  }}
                >
                  <ClearAllIcon color="error" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Stack>
        {activeListName && (
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 0.5 
            }}
          >
            <LocalOfferIcon fontSize="small" />
            Currently editing: {activeListName}
          </Typography>
        )}
      </Box>

      {/* Savings Summary */}
      {items.length > 0 && (
        <Card 
          sx={{ 
            bgcolor: alpha(theme.palette.success.main, 0.1),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
          }}
        >
          <CardContent>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalOfferIcon color="success" />
                <Typography variant="h6" color="success.main" fontWeight="medium">
                  Total Savings
                </Typography>
              </Box>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                R{calculateTotalSavings().toFixed(2)}
              </Typography>
              <Typography variant="body2" color="success.main">
                You're saving {calculateSavingsPercentage()}% on your shopping!
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
      {/* Scrollable Items Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.primary.main, 0.2),
            borderRadius: '4px',
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.3),
            },
          },
        }}
        onScroll={(e) => e.stopPropagation()}
      >
        {items.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              opacity: 0.7,
              py: 4
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
            <Typography variant="body1" color="text.secondary">
              Your shopping list is empty
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add items from the product list
            </Typography>
          </Box>
        ) : (
          items.map((item, index) => {
            const currentPrice = parseFloat(item.currentPrice.replace('R', ''));
            const oldPrice = item.originalProduct.old 
              ? parseFloat(item.originalProduct.old.replace('R', ''))
              : currentPrice;
            const itemSavings = (oldPrice - currentPrice) * item.quantity;

            return (
              <Card 
                key={index} 
                sx={{ 
                  width: '100%',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1, mr: 2 }}>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight="medium" 
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.2,
                            mb: 1
                          }}
                        >
                          {item.title}
                        </Typography>
                        {item.originalProduct['ng-star-inserted'] && (
                          <Box 
                            sx={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                              color: theme.palette.warning.main,
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              gap: 0.5,
                              maxWidth: '100%',
                              overflow: 'hidden'
                            }}
                          >
                            <LocalOfferIcon sx={{ fontSize: 14, flexShrink: 0 }} />
                            <Typography 
                              variant="caption" 
                              fontWeight="medium"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.originalProduct['ng-star-inserted']}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <IconButton 
                        onClick={() => onRemoveItem(item)}
                        size="small"
                        sx={{ 
                          flexShrink: 0,
                          '&:hover': { 
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            color: theme.palette.error.main
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1
                    }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton 
                          size="small" 
                          onClick={() => onUpdateQuantity(item, -1)}
                          disabled={item.quantity <= 1}
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover:not(:disabled)': { 
                              bgcolor: alpha(theme.palette.primary.main, 0.2) 
                            }
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography 
                          sx={{ 
                            minWidth: '30px', 
                            textAlign: 'center',
                            fontWeight: 'medium'
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => onUpdateQuantity(item, 1)}
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': { 
                              bgcolor: alpha(theme.palette.primary.main, 0.2) 
                            }
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <Stack alignItems="flex-end">
                        {item.originalProduct.old && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                              textDecoration: 'line-through',
                              mb: 0.5
                            }}
                          >
                            Was R{item.originalProduct.old}
                          </Typography>
                        )}
                        <Typography variant="subtitle1" fontWeight="medium" color="primary.main">
                          R{(currentPrice * item.quantity).toFixed(2)}
                        </Typography>
                      </Stack>
                    </Box>

                    {itemSavings > 0 && (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                          p: 1.5,
                          borderRadius: 1,
                          gap: 1
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocalOfferIcon color="success" sx={{ fontSize: 20 }} />
                          <Typography variant="body2" color="success.main" fontWeight="medium">
                            You save:
                          </Typography>
                        </Stack>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            R{itemSavings.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            {((itemSavings / (oldPrice * item.quantity)) * 100).toFixed(0)}% off
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>

      {/* Footer Section - Fixed */}
      {items.length > 0 && (
        <Box 
          sx={{ 
            p: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.default,
            flexShrink: 0
          }}
        >
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})
              </Typography>
              <Typography variant="h6">
                R{calculateTotalPrice().toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="success.main">
                Total Savings
              </Typography>
              <Typography variant="h6" color="success.main" fontWeight="medium">
                R{calculateTotalSavings().toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default ShoppingList;
