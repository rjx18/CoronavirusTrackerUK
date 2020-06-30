import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import SummaryStats from './SummaryStats'
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        borderRadius: 20,
        padding: "20px 40px",
    },
    content: {
        padding: 0,
    },
    title: {
       
    },
  });

function Chart() {
    const classes = useStyles();
    
    return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Box display="flex" flexDirection="row">
            <Box width="50%" alignSelf="flex-end">
                <Typography className={classes.title} variant="h4" component="h4">
                    <b>Cases</b>
                </Typography>
            </Box>
            <Box width="50%">
                <SummaryStats />
            </Box>
        </Box>
        
      </CardContent>
    </Card>
    )
}

export default Chart
