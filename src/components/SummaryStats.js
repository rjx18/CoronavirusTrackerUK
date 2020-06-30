import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        textAlign: 'right'
     },
    title: {
       fontSize: 14
    },
  });

function SummaryStats() {
    const classes = useStyles();

    return (
        <Box className={classes.root}> 
            <Typography variant="subtitle1" className={classes.title}>
                Total
            </Typography>
            <Typography variant="h5" component="h5">
                <b>123,231</b>
            </Typography>
        </Box>
    )
}

export default SummaryStats;
