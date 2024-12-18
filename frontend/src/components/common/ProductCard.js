import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, CardActionArea } from '@mui/material';

const ProductCard = ({ 
  title, 
  currentPrice, 
  oldPrice, 
  imageUrl, 
  promotion,
  retailer,
  additionalInfo = {},
  onAddToList,
  isInList
}) => {
  return (
    <Card 
      className={`product-card ${retailer.toLowerCase()}-card`}
      sx={{ 
        opacity: isInList ? 0.7 : 1,
        position: 'relative'
      }}
    >
      <CardActionArea onClick={() => onAddToList?.()}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={title}
          onError={(e) => {
            e.target.src = '/placeholder.png';
          }}
        />
        <CardContent>
          <Typography className="retailer-badge" color="textSecondary" gutterBottom>
            {retailer}
          </Typography>
          <Typography className="product-title" variant="h6">
            {title}
          </Typography>
          <Box className="price-container">
            {oldPrice && (
              <Typography className="old-price" variant="body2">
                R{oldPrice}
              </Typography>
            )}
            <Typography className="price" variant="h6">
              R{currentPrice}
            </Typography>
          </Box>
          {promotion && (
            <Typography className="promotion" color="error">
              {promotion}
            </Typography>
          )}
          {Object.entries(additionalInfo).map(([key, value]) => (
            <Typography key={key} variant="body2" color="textSecondary">
              {key}: {value}
            </Typography>
          ))}
        </CardContent>
      </CardActionArea>
      {isInList && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'success.main',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem'
          }}
        >
          Added
        </Box>
      )}
    </Card>
  );
};

export default ProductCard;
