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
    position: "relative"
  },
  content: {
    paddingBottom: 100,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  footerContent: {
    margin: "20px 30px"
  },
  footerText: {
    color: "#bfbfbf",
    fontSize: 12
  }
}));

function App() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Navbar />
      <Box 
        className="content-card" >
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
        <Box className={classes.content}>
          <DataControl />
        </Box>
      </Box>
      <Box className={classes.footer}>
        <Box className={classes.footerContent} display="flex">
          <Typography className={classes.footerText} variant="body2" gutterBottom>
            <b>für Lucy</b>, ich vermisse dich und leibe dich
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default App;
