import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Box, Typography } from '@material-ui/core';
import Navbar from './components/Navbar';
import ChartPage from './components/cases';
import MapPage from './components/map';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
  const smMedia = useMediaQuery('(max-width:400px)');
  const classes = useStyles();
  
  return (
    <div className={classes.root}>

    <Router>
      <Route exact path="/">
          <Redirect to="/cases" />
      </Route>
      <Navbar />
      <Box py={10}>
        <Switch>
          <Route exact path="/cases" component={ChartPage} />
          <Route exact path="/map" component={MapPage} />
          <Redirect to="/cases" />
        </Switch>
      </Box>
    </Router>

      {/* Footer */}
      <Box className={classes.footer}>
        <Box className={classes.footerContent} display="flex">
          {
            smMedia ? 
            <></>
            :
            <Box flexGrow={1}>
              <Typography className={classes.footerText} variant="body2" gutterBottom>
                created by <b>u/richhard</b>
              </Typography>
            </Box>
          }
          <Typography className={classes.footerText} variant="body2" gutterBottom>
            <b>für Lucy</b>, ich vermisse dich und liebe dich
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default App;
