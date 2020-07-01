import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { Box, Typography } from '@material-ui/core';
import Navbar from './components/Navbar';
import DataControl from './components/DataControl';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    paddingBottom: '10%'
  }
}));

function App() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Navbar />
      <Box className="content-card">
        <Box 
        display="flex" 
        flexDirection="row-reverse" 
        justifyContent="center" 
        alignItems="center" 
        m={1} p={1}
        css={{ height: 150 }}>
          <Typography variant="h4" gutterBottom>
            <b>Coronavirus cases by region</b>
          </Typography>
        </Box>
        <Box>
          <DataControl />
        </Box>
      </Box>
    </div>
  );
}

export default App;
