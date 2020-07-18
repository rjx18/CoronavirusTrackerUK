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
import  * as DateUtils from '../../DateUtils';

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
        ...theme.typography.button,
       textAlign: 'center',
       fontSize: 18,
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
    const [showLogarithmic, setShowLogarithmic] = useState(false);

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

    /* Data Processing Code */

    const generateDateLabels = useCallback((firstStr, lastStr) => {
        var lastDate = DateUtils.stringToDate(lastStr);
        var firstDate = DateUtils.stringToDate(firstStr);
        var dateLabels = [];
        while (firstDate <= lastDate) {
            dateLabels.push(DateUtils.dateToString(firstDate));
            DateUtils.incrementDate(firstDate);
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
                var previousIndex = 0;
                for (var i = regionCase.cases.length - 1; i >= 0; i--) {
                    const c = regionCase.cases[i];
                    if (c.specimenDate === getLastUpdateDate()) {
                        totalCases += c.totalLabConfirmedCases;
                    }
                    const index = graphLabels.findIndex((e) => e === c.specimenDate);
                    const currentCases = chartMode === 0 ? c.dailyLabConfirmedCases : c.totalLabConfirmedCases;
                    caseData[index] = currentCases;

                    if (chartMode === 1 && index !== previousIndex + 1) {
                        for (var j = previousIndex + 1; j < index; j++) {
                            caseData[j] = caseData[previousIndex];
                            //totalDailyCases[j] += caseData[j];
                        }
                    }
                    previousIndex = index;

                    if (chartMode === 0) {
                        totalDailyCases[index] += currentCases;
                    }
                }
                graphDatasets.push({
                    label: regionCase.region.REGIONNAME,
                    regionCode: regionCase.region.REGIONCODE,
                    data: caseData,
                  });
            }

            // Process rolling average (only for daily)
            if (chartMode === 0) {
                var rollingAverageCases = new Array(graphLabels.length).fill(null);
                for (i = 3; i < totalDailyCases.length - 3; i++) {
                    var average = 0;
                    for (j = i - 3; j <= i + 3; j++) {
                        average += totalDailyCases[j];
                    }
                    rollingAverageCases[i] = (average / 7).toFixed(2);
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
            }

            const graphLabelsParsed = graphLabels.map((e) => {return DateUtils.parseDateShort(DateUtils.stringToDate(e))});

            setGraphData({
                labels: graphLabelsParsed,
                datasets: graphDatasets
            })

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
                        <Box width="50%" alignSelf="flex-end" ml={smMedia ? 2 : 0}>
                            <Typography className={classes.title} variant="h4" component="h4">
                                <b>Cases</b>
                            </Typography>
                        </Box>
                        <Box width="50%" mr={smMedia ? 2 : 0}>
                            <SummaryStats total={total}/>
                        </Box>
                    </Box>
                    <Box display={{xs: 'block', md: "flex"}} alignItems="center">
                        <Box flexGrow={1} mb={2} ml={smMedia ? 2 : 0}>
                            <Tabs value={chartMode} onChange={(event, newValue) => setChartMode(newValue)}>
                                <Tab label="Daily" value={0} />
                                <Tab label="Cumulative" value={1} />
                            </Tabs>
                        </Box>
                        {chartMode === 0 ? 
                        <Box mb={2}  mr={smMedia ? 2 : 0}>
                            <FormControlLabel
                                classes={{label: classes.label}}
                                control={<Switch checked={showAverage} onChange={(event, newValue) => setShowAverage(newValue)} name="average" />}
                                label="Show 7-day rolling average"
                                labelPlacement="start"
                            />
                        </Box> : 
                        <Box mb={2} mr={smMedia ? 2 : 0}>
                        <FormControlLabel
                            classes={{label: classes.label}}
                            control={<Switch checked={showLogarithmic} onChange={(event, newValue) => setShowLogarithmic(newValue)} name="logarithmic" />}
                            label="Show logarithmic axes"
                            labelPlacement="start"
                        />
                        </Box>
                        }

                    </Box>
                    <Graph data={graphData} showAverage={showAverage} showLogarithmic={chartMode !== 0 && showLogarithmic} />
                </Box>
            }
        </CardContent>
    </Card>
    )
}

export default Chart
