import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DataControl from './DataControl';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  title: {
    color: '#333333',
  }, 
  contentBox: {
    height: 150
  },
  infoButton: {
    marginLeft: 5,
    marginBottom: 2,
    color: "#bdbdbd"
  },
  infoCard: {
    padding: "10px 20px",
    width: 300,
    height: 200,
    overflowY: "scroll",
    overflowX: "hidden"
  }
}));

function ChartPage(props) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleInfoClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };
  
  const handleClickAway = () => {
    setOpen(false);
  };

  return (
      <Box 
        className="content-card" >
        <Box 
        display="flex" 
        flexDirection="row-reverse" 
        justifyContent="center" 
        alignItems="center" 
        m={1}
        className={classes.contentBox}>
          <Typography variant="h4" gutterBottom className={classes.title}>
            <b>Coronavirus cases by region</b>
            <IconButton className={classes.infoButton} aria-label="About the data" size="small" onClick={handleInfoClick}>
              <InfoOutlinedIcon fontSize="inherit"/>
            </IconButton>
          </Typography>
          <Popper open={open} anchorEl={anchorEl} placement={'bottom'} transition>
            {({ TransitionProps }) => (
              <ClickAwayListener onClickAway={handleClickAway}>
                <Fade {...TransitionProps} timeout={350}>
                  <Paper className={classes.infoCard}>
                    <Typography variant="h6"><b>About the data</b></Typography>
                    <hr/>
                    <Typography variant="body2">
                      Data for charts obtained from the <a href= "https://coronavirus.data.gov.uk/" target="_blank" rel="noopener noreferrer">GOV.UK coronavirus dashboard</a>.
                      <br/>
                      <br/>
                      <b>Pillar 2 cases for England are also now included in the SGSS data feed from PHE. </b> 
                      In England, laboratories submit test results to PHE through the Second Generation Surveillance System (SGSS). 
                      Cases received from laboratories by 12:30am are included in the counts published that day. 
                      Confirmed positive cases are matched to ONS geographical area codes using the home postcode of the person tested. 
                      Postcodes are supplied by the laboratory information systems.
                      <br/>
                      <br/>
                      Duplicate tests for the same person are removed. The first positive specimen date is used as the specimen date for that person.
                      <br/>
                      <br/>
                      <b>About the calculations: </b>The 7-day rolling average for each day is calculated using the sum of the case counts from that day, together with the counts from each of 3 days before and after.
                      The threshhold for data likely to change is 10 days from the current date, which was chosen based on the reasoning that 10 days is a reasonable worst-case estimate for 
                      the delivery of test results. However, this was still decided arbitrarily by me, so believe it as you wish.
                      <br/>
                      <br/>
                      For more information about how the cases are collected, visit <a href= "https://coronavirus.data.gov.uk/about" target="_blank" rel="noopener noreferrer">here</a>.
                    </Typography>
                  </Paper>
                </Fade>
              </ClickAwayListener>
            )}
          </Popper>
          
        </Box>
        <Box         
          display="flex" 
          flexDirection="row-reverse" 
          justifyContent="center" 
          alignItems="center">
          <Box pb={10} width="85%">
            <Alert severity="info">
              <AlertTitle>Thank you for using this website!</AlertTitle>
              <Box lineHeight={1.7}>
                However, as of <strong>2 August 2020</strong>, the GOV.UK API that feeds data into this website will <strong>no longer be updated</strong>. 
                <br/>
                Since the new GOV.UK dashboard has implemented similar features and more, I highly recommend using their dashboard instead to obtain case information. 
                <br/>
                I will therefore no longer be maintaining this project in the future. Thank you all for your support!
              </Box>
            </Alert>
          </Box>
        </Box>
        <Box>
          <DataControl {...props} />
        </Box>
      </Box>
  );
}

export default ChartPage
