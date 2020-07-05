import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from "react-router-dom";
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import MenuIcon from '@material-ui/icons/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import BarChartIcon from '@material-ui/icons/BarChart';
import MapIcon from '@material-ui/icons/Map';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#ffffff',
    boxShadow: '0 3px 5px 2px rgba(200, 200, 200, .3)'
  },
  title: {
    marginRight: 15,
    color: '#333333'
  },
  button: {
    margin: theme.spacing(1),
    color: '#7A7A7A'
  },
  activeButton: {
    margin: theme.spacing(1),
    backgroundColor: '#f6f6f6',
    color:'#333333'
  },
  drawer: {
    width: '15em'
  },
  drawerListText: {
    ...theme.typography.button,
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navbar() {
  const classes = useStyles();
  const smMedia = useMediaQuery('(max-width:700px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
  };

  return (
    <div className={classes.root}>
      <SwipeableDrawer
        anchor='left'
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <List className={classes.drawer}>
          <ListItem button key="drawer-cases" component={NavLink} exact to={'/cases'} activeClassName='Mui-selected' onClick={toggleDrawer(false)}>
              <ListItemIcon><BarChartIcon /></ListItemIcon>
              <ListItemText classes={{primary: classes.drawerListText}} primary={'Cases by region'} />
          </ListItem>
          <ListItem button key="drawer-cases" component={NavLink} exact to={'/map'} activeClassName='Mui-selected' onClick={toggleDrawer(false)}>
              <ListItemIcon><MapIcon /></ListItemIcon>
              <ListItemText classes={{primary: classes.drawerListText}} primary={'Map'} />
          </ListItem>
        </List>
      </SwipeableDrawer>
      <HideOnScroll>
        <AppBar color="transparent" className={classes.appBar}>
            <Toolbar>
            <Box display={smMedia ? 'block' : 'none'}>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box flexGrow={smMedia ? 1 : 0}>
              <Typography variant="h6" className={classes.title}>
                  COVID Tracker UK
              </Typography>
            </Box>
            <Box flexGrow={1} display={ smMedia ? 'none' : 'block' }>
              <Button 
                color="inherit" 
                className={classes.button}
                startIcon={<BarChartIcon />}
                component={NavLink} exact to={'/cases'}
                activeClassName={classes.activeButton}>Cases by region</Button>
              <Button 
                color="inherit" 
                className={classes.button}
                startIcon={<MapIcon />}
                component={NavLink} exact to={'/map'}
                activeClassName={classes.activeButton}>Map</Button>
            </Box>
            <Button color="inherit" href="https://paypal.me/richhardry?locale.x=en_GB" target="_blank" className={classes.button}>Support my work</Button>
            </Toolbar>
        </AppBar>
      </HideOnScroll>
    </div>
  );
}
