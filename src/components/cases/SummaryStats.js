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

function SummaryStats({total}) {
    const classes = useStyles();

    const formatThousands = (x) => {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }


    return (
        <Box className={classes.root}> 
            <Typography variant="subtitle1" className={classes.title}>
                Total
            </Typography>
            <Typography variant="h5" component="h5">
                <b>{formatThousands(total)}</b>
            </Typography>
        </Box>
    )
}

export default SummaryStats;
