import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import  * as DateUtils from '../../DateUtils';

const useStyles = makeStyles({
    root: {
        textAlign: 'right'
     },
    title: {
       fontSize: 14
    },
  });

function SummaryStats({date}) {
    const classes = useStyles();

    return (
        <Box className={classes.root}> 
            <Typography variant="subtitle1" className={classes.title}>
                Date
            </Typography>
            <Typography variant="h5" component="h5">
                <b>{DateUtils.parseDateFull(date)}</b>
            </Typography>
        </Box>
    )
}

export default SummaryStats;
