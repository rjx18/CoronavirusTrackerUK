import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useEffect, useState, } from 'react';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import ReplayIcon from '@material-ui/icons/Replay';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MapComponent from './MapComponent';
import SummaryDate from './SummaryDate';
import  * as DateUtils from '../../DateUtils';

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: 20,
    },
    content: {
        padding: 0,
        width: "100%"
    },
    formControlLabel: {
        marginLeft: 0
    },
    label: {
        ...theme.typography.button
    },
    speedSelect: {
        padding: 5,
        minHeight: 0,
        minWidth: 50,
    },
    speedSelectItem: {
        ...theme.typography.button
    }
  }));

const sliderBoxShadow =
  '0 1px 0px rgba(0,0,0,0.1),0 3px 6px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const DateSlider = withStyles({
    root: {
        color: '#f50057',
        height: 0,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        boxShadow: sliderBoxShadow,
        '&:focus, &:hover, &$active': {
            boxShadow:
                '0 1px 0px rgba(0,0,0,0.1),0 3px 6px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                boxShadow: sliderBoxShadow,
            },
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
        color: '#fa80ab'
    },
    rail: {
        height: 8,
        borderRadius: 4,
        color: '#e0e0e0'
    },
    })(Slider);

function ValueLabelComponent(props) {
    const { children, open, value } = props;

    const title = DateUtils.parseDateShort(DateUtils.incrementDateBy(DateUtils.getMapInitialDate(), value));
    
    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={title} arrow>
        {children}
        </Tooltip>
    );
}

ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
};

const speedOptions = [
    {
        label: '0.5x',
        speed: 0.5
    },
    {
        label: '0.75x',
        speed: 0.75
    },
    {
        label: '1.0x',
        speed: 1.0
    },
    {
        label: '1.5x',
        speed: 1.5
    },
    {
        label: '2.0x',
        speed: 2.0
    },
  ];

function CaseMap({mapGeoJson, mapCases, mapMode, handleMapModeChange, latestDate, history}) {
    const smMedia = useMediaQuery('(max-width:700px)');

    const classes = useStyles();

    const [playing, setPlaying] = useState(false);

    const numDays = DateUtils.getNumDatesBetween(latestDate, DateUtils.getMapInitialDate());

    // speed select
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSpeedIndex, setSelectedSpeedIndex] = useState(2);

    // Dates
    const [dateIndex, setDateIndex] = useState(numDays);
    const [currentDate, setCurrentDate] = useState(new Date(latestDate.getTime()));

    //Map options
    const [perMillion, setPerMillion] = useState(true);
    const [caseIncrease, setCaseIncrease] = useState(false);

    /* useEffect */

    useEffect(() => {
        setCurrentDate(DateUtils.incrementDateBy(DateUtils.getMapInitialDate(), dateIndex));
    }, [dateIndex])

    useEffect(() => {
        if (playing && dateIndex < numDays) {
            const interval = setInterval(() => {
                    if (dateIndex >= numDays - 1) {
                        setPlaying(false);
                    }
                    setDateIndex(dateIndex => dateIndex + 1);
            }, 200 / speedOptions[selectedSpeedIndex].speed);

            return () => {
                clearInterval(interval);
            };
        } else if (playing && dateIndex >= numDays) {
            setDateIndex(0);
        }
      }, [playing, selectedSpeedIndex, dateIndex, numDays]);

    /* Action Handlers */

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleMenuItemClick = (event, index) => {
        setSelectedSpeedIndex(index);
        setAnchorEl(null);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

    /* render */

    return (
        <Card className={classes.root} style={smMedia ? {padding: "20px 10px 10px 10px"} : {padding: "20px 40px 40px 40px"}}>
            <CardContent className={classes.content} style={{paddingBottom: "0px"}}>
                <Box>
                    <Box display="flex" flexDirection="row">
                        <Box width="50%" alignSelf="flex-end" ml={smMedia ? 2 : 0}>
                            <Typography className={classes.title} variant="h4" component="h4">
                                <b>Map</b>
                            </Typography>
                        </Box>
                        <Box width="50%" mr={smMedia ? 2 : 0}>
                            <SummaryDate date={currentDate} dataChange={dateIndex > numDays - 10}/>
                        </Box>
                    </Box>
                    <Box>
                        <Box display={{xs: 'block', md: "flex"}} alignItems="center">
                            <Box flexGrow={1} mb={2} ml={smMedia ? 2 : 0} >
                                <Tabs value={mapMode} onChange={(event, newValue) => handleMapModeChange(newValue)}>
                                    <Tab label="Daily" value={1} />
                                    <Tab label="Cumulative" value={0} />
                                </Tabs>
                            </Box>
                            {/* {chartMode === 0 ?  */}
                            <Box mb={2} mr={smMedia ? 2 : 0}>
                                <FormControlLabel
                                    classes={{label: classes.label}}
                                    control={<Switch checked={perMillion} name="per-million" onChange={(event, newValue) => setPerMillion(newValue)}/>}
                                    label="Show cases per million"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    classes={{label: classes.label}}
                                    control={<Switch checked={caseIncrease} name="case-increase" onChange={(event, newValue) => setCaseIncrease(newValue)}/>}
                                    label="Show case increase/decrease"
                                    disabled={mapMode === 0}
                                    labelPlacement="start"
                                />
                            </Box>
                        </Box>
                        <Box display={{xs: 'block', md: "flex"}} alignItems="center">
                            <Box flexGrow={1} mb={2} ml={smMedia ? 2 : 0} mr={2} >
                                <DateSlider ValueLabelComponent={ValueLabelComponent} valueLabelDisplay="auto" aria-label="date slider" value={dateIndex} max={numDays} onChange={(event, value) => {setDateIndex(value)}}/>
                            </Box>
                            <Box mb={2} ml={2} mr={smMedia ? 2 : 0}>
                                <Fab style={{ marginRight: 10 }} color="secondary" aria-label="play" size="medium" onClick={() => setPlaying(!playing)}>
                                    {
                                        playing ? 
                                        <PauseIcon /> :
                                        <PlayArrowIcon />
                                    }
                                </Fab>
                                <IconButton aria-label="replay" size="medium" style={{ marginRight: 5 }} onClick={() => setDateIndex(0)}>
                                    <ReplayIcon />
                                </IconButton>
                                <Button 
                                    className={classes.speedSelect}
                                    aria-label="select speed"
                                    onClick={handleClickListItem}>{speedOptions[selectedSpeedIndex].label}</Button>
                                <Menu
                                    id="map-speed-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    {speedOptions.map((option, index) => (
                                        <MenuItem
                                            key={option.label}
                                            selected={index === selectedSpeedIndex}
                                            onClick={(event) => handleMenuItemClick(event, index)}
                                            className={classes.speedSelectItem}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Box>
                    </Box>
                    
                    <MapComponent 
                        geojson={mapGeoJson} 
                        casesForDate={mapCases.find((e) => {return e.date.getTime() === currentDate.getTime()})} 
                        perMillion={perMillion}
                        caseIncrease={caseIncrease}
                        mapMode={mapMode}
                        history={history}/>
                </Box>
            </CardContent>
        </Card>
      
    )
}

export default CaseMap
