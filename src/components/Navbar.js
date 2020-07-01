import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#ffffff',
    boxShadow: '0 3px 5px 2px rgba(200, 200, 200, .3)'
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <AppBar position="static" color="transparent" className={classes.appBar}>
            <Toolbar>
            <Typography variant="h6" className={classes.title}>
                Coronavirus Tracker UK
            </Typography>
            <Button color="inherit" href="https://paypal.me/richhardry?locale.x=en_GB" target="_blank">Support my work</Button>
            </Toolbar>
        </AppBar>
    </div>
  );
}
