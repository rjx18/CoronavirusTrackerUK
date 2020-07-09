import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Box, Typography } from '@material-ui/core';
import Navbar from './components/Navbar';
import ChartPage from './components/cases';
import MapPage from './components/map';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    position: "relative"
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

    <Router>
      <Navbar />
      <Box py={10}>
        <Route exact path="/cases" component={ChartPage} />
        <Route exact path="/map" component={MapPage} />
      </Box>
      <Redirect exact from="/" to="/cases" />
      </Router>

      {/* Footer */}
      <Box className={classes.footer}>
        <Box className={classes.footerContent} display="flex">
          <Typography className={classes.footerText} variant="body2" gutterBottom>
            <b>für Lucy</b>, ich vermisse dich und liebe dich
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default App;
