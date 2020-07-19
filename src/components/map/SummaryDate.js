import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import  * as DateUtils from '../../DateUtils';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

const useStyles = makeStyles({
    root: {
        textAlign: 'right'
     },
    title: {
       fontSize: 14
    },
    infoButton: {
        marginBottom: 5,
        marginRight: 2,
        color: "#ef5350"
    },
  });

function SummaryStats({date, dataChange}) {
    const classes = useStyles();

    return (
        <Box className={classes.root}> 
            <Typography variant="subtitle1" className={classes.title}>
                Date
            </Typography>
            <Typography variant="h5" component="h5">
                {
                    dataChange ?
                    <Tooltip title="Date likely to change!" arrow>
                        <IconButton className={classes.infoButton} aria-label="About the data" size="small">
                            <WarningRoundedIcon fontSize="inherit"/>
                        </IconButton>
                    </Tooltip> :
                    <></>
                }
                <b>{DateUtils.parseDateFull(date)}</b>
            </Typography>
        </Box>
    )
}

export default SummaryStats;
