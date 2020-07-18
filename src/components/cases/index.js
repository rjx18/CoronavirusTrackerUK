import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DataControl from './DataControl';

const useStyles = makeStyles((theme) => ({
  title: {
    color: '#333333',
  }, 
  contentBox: {
    height: 150
  }
}));

function ChartPage(props) {

  const classes = useStyles();
  
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
          </Typography>
        </Box>
        <Box>
          <DataControl {...props} />
        </Box>
      </Box>
  );
}

export default ChartPage
