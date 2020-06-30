import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { Box, Typography } from '@material-ui/core';
import Navbar from './components/Navbar';
import DataControl from './components/DataControl';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundColor: '#fafafa',
  },
}));

function App() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Navbar />
      <Box px="15%">
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
        <DataControl />
      </Box>
    </div>
  );
}

export default App;
