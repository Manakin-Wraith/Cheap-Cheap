import React, { useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Tab, Tabs, Box } from '@mui/material';
import PnPProductList from './components/retailers/pnp/PnPProductList';
import SavedLists from './components/common/SavedLists';
import './App.css';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} role="tabpanel" id={`retailer-tabpanel-${index}`}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [activeListId, setActiveListId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSetActiveList = (listId) => {
    setActiveListId(listId);
    setCurrentTab(0); // Switch to PnP products tab
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SA Retail Promotions
          </Typography>
        </Toolbar>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          centered
          indicatorColor="secondary"
          textColor="inherit"
          sx={{ 
            bgcolor: 'primary.dark',
            '& .MuiTab-root': {
              color: 'white',
              '&.Mui-selected': {
                color: 'secondary.main',
              },
            },
          }}
        >
          <Tab label="Pick n Pay" />
          <Tab label="Saved Lists" />
          {/* Add more retailers here */}
        </Tabs>
      </AppBar>

      <Container maxWidth="xl">
        <TabPanel value={currentTab} index={0}>
          <PnPProductList activeListId={activeListId} onListChange={setActiveListId} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <SavedLists onSelectList={handleSetActiveList} activeListId={activeListId} />
        </TabPanel>
        {/* Add more TabPanels for other retailers */}
      </Container>
    </div>
  );
}

export default App;
