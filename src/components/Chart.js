import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState, useCallback } from 'react';
import Graph from './Graph';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import SummaryStats from './SummaryStats'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: 20,
    },
    content: {
        padding: 0,
    },
    title: {
       
    },
    emptyTitle: {
       textAlign: 'center',
       marginTop: 20
    },
    label: {
        ...theme.typography.button
    },
  }));

function Chart({regionCases}) {
    const smMedia = useMediaQuery('(max-width:700px)');

    const classes = useStyles();

    /* useState */

    const [total, setTotal] = useState(0);
    const [graphData, setGraphData] = useState(null);
    const [chartMode, setChartMode] = useState(0);
    const [showAverage, setShowAverage] = useState(true);

    /* Date processing code */

    const getLastUpdateDate = useCallback(
        () => {
            return regionCases[0].cases[0].specimenDate;
        },
        [regionCases],
    )

    const getFirstUpdateDate = useCallback(
        () => {
            //first update date might not be the same for all regions
            var firstDate = regionCases[0].cases[0].specimenDate;
            for (const regionCase of regionCases) {
                if (regionCase.cases[regionCase.cases.length - 1].specimenDate < firstDate) {
                    firstDate = regionCase.cases[regionCase.cases.length - 1].specimenDate;
                }
            }
            return firstDate;
        },
        [regionCases],
    )

    const incrementDate = (d) => {
        d.setDate(d.getDate() + 1);
    }

    const dateToString = (d) => {
        return new Date(d.getTime() - (d.getTimezoneOffset() * 60000 ))
                .toISOString()
                .split("T")[0];
    }

    const stringToDate = (str) => {
        return new Date(str);
    }

    /* Data Processing Code */

    const generateDateLabels = useCallback((firstStr, lastStr) => {
        var lastDate = stringToDate(lastStr);
        var firstDate = stringToDate(firstStr);
        var dateLabels = [];
        while (firstDate <= lastDate) {
            dateLabels.push(dateToString(firstDate));
            incrementDate(firstDate);
        }
        return dateLabels;
    }, []);

    const processGraphData = useCallback(
        () => {
            var totalCases = 0;

            const graphLabels = generateDateLabels(getFirstUpdateDate(), getLastUpdateDate());

            var graphDatasets = [];

            var totalDailyCases = new Array(graphLabels.length).fill(0);

            // Process case data for each region
            for (const regionCase of regionCases) {
                var caseData = new Array(graphLabels.length).fill(0);
                for (const c of regionCase.cases) {
                    if (c.specimenDate === getLastUpdateDate()) {
                        totalCases += c.totalLabConfirmedCases;
                    }
                    const index = graphLabels.findIndex((e) => e === c.specimenDate);
                    const currentCases = chartMode === 0 ? c.dailyLabConfirmedCases : c.totalLabConfirmedCases;
                    caseData[index] = currentCases;
                    totalDailyCases[index] += currentCases;
                }
                graphDatasets.push({
                    label: regionCase.region.REGIONNAME,
                    regionCode: regionCase.region.REGIONCODE,
                    data: caseData,
                  });
            }

            var rollingAverageCases = new Array(graphLabels.length).fill(null);

            // Process rolling average
            for (var i = 3; i < totalDailyCases.length - 3; i++) {
                var average = 0;
                for (var j = i - 3; j <= i + 3; j++) {
                    average += totalDailyCases[j];
                }
                rollingAverageCases[i] = average / 7;
            }

            graphDatasets.push({
                label: 'Rolling average',
                isAverage: true,
                data: rollingAverageCases,
                borderColor: 'rgba(100,100,100,1)',
                borderWidth: 1,
                pointRadius: 2,
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                type: 'line'
            })

            setGraphData({
                labels: graphLabels,
                datasets: graphDatasets
            })

            // regions.forEach((item, index) => {
            //     console.log(item, index);
            // });

            // for (var i = 0; i < cases.length; i++) {
            //     if (cases[i].specimenDate === getLastUpdateDate()) {
            //         totalCases += cases[i].totalLabConfirmedCases;
            //     }
            // }
            setTotal(totalCases);
        },
        [regionCases, chartMode, getLastUpdateDate, getFirstUpdateDate, generateDateLabels],
    )

    /* useEffect */

    useEffect(() => {
        if (regionCases.length > 0) {
            console.log("Date interval from: " + getFirstUpdateDate() + " to " + getLastUpdateDate());
            processGraphData();
        } else {
            console.log("Nothing selected!");
        }
    }, [regionCases, processGraphData, getFirstUpdateDate, getLastUpdateDate]);

    /* Action handlers */

    /* render */

    return (
    <Card className={classes.root} style={smMedia ? {padding: "20px 10px"} : {padding: "20px 40px"}}>
        <CardContent className={classes.content}>
            {
                !graphData ? 
                <Typography className={classes.emptyTitle} variant="h5" component="h5">
                    Select a region to begin.
                </Typography> :
                <Box>
                    <Box display="flex" flexDirection="row">
                        <Box width="50%" alignSelf="flex-end">
                            <Typography className={classes.title} variant="h4" component="h4">
                                <b>Cases</b>
                            </Typography>
                        </Box>
                        <Box width="50%">
                            <SummaryStats total={total}/>
                        </Box>
                    </Box>
                    <Box display={{xs: 'block', md: "flex"}}>
                        <Box flexGrow={1}>
                            <Tabs value={chartMode} onChange={(event, newValue) => setChartMode(newValue)}>
                                <Tab label="Daily" value={0} />
                                <Tab label="Cumulative" value={1} />
                            </Tabs>
                        </Box>
                        <Box>
                            <FormControlLabel
                                classes={{label: classes.label}}
                                control={<Switch checked={showAverage} onChange={(event, newValue) => setShowAverage(newValue)} name="average" />}
                                label="Show 7-day rolling average"
                                labelPlacement="start"
                            />
                        </Box>
                    </Box>
                    <Graph data={graphData} showAverage={showAverage} />
                </Box>
            }
        </CardContent>
    </Card>
    )
}

export default Chart
