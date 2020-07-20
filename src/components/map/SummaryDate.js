import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import  * as DateUtils from '../../DateUtils';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
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
    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
      };
    
    const handleTooltipToggle = () => {
    setOpen(!open);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
        };

    return (
        <Box className={classes.root}> 
            <Typography variant="subtitle1" className={classes.title}>
                Date
            </Typography>
            <Typography variant="h5" component="h5">
                {
                    dataChange ?
                    <ClickAwayListener onClickAway={handleTooltipClose}>
                        <Tooltip 
                            title="Date likely to change!" 
                            arrow
                            onClose={handleTooltipClose}
                            onOpen={handleTooltipOpen}
                            onHover
                            open={open}
                            >
                            <IconButton className={classes.infoButton} aria-label="About the data" size="small" onClick={handleTooltipToggle}>
                                <WarningRoundedIcon fontSize="inherit"/>
                            </IconButton>
                        </Tooltip>
                    </ClickAwayListener> :
                    <></>
                }
                <b>{DateUtils.parseDateFull(date)}</b>
            </Typography>
        </Box>
    )
}

export default SummaryStats;
