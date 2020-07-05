import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState, useCallback, useRef } from 'react';
import Card from '@material-ui/core/Card';
import './CaseMap.css'
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: 20,
    },
    content: {
        padding: 0,
        width: "100%"
    },
    map: {
        height: 700,
        width: "100%",
        borderRadius: 20,
        margin: "20px 0px"
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

function CaseMap() {
    var mapRef = useRef();

    const smMedia = useMediaQuery('(max-width:700px)');

    const classes = useStyles();
    
    const [state, setState] = useState({
        lat: 52.3555,
        lng: -2.4743,
        zoom: 7,
      });

      const position = [state.lat, state.lng]

    useEffect(() => {
        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.leafletElement.invalidateSize();
            }
        }, 100);
    }, []);

    return (
        <Card className={classes.root} style={smMedia ? {padding: "20px 10px"} : {padding: "40px 40px"}}>
            <CardContent className={classes.content} style={{paddingBottom: "0px"}}>
                <Box>
                    <Box display="flex" flexDirection="row">
                        <Box width="50%" alignSelf="flex-end">
                            <Typography className={classes.title} variant="h4" component="h4">
                                <b>Map</b>
                            </Typography>
                        </Box>
                        <Box width="50%">
                            {/* Date display */}
                        </Box>
                    </Box>
                    <Box display={{xs: 'block', md: "flex"}}>
                        <Box flexGrow={1}>
                            <Tabs value={0}>
                                <Tab label="By UTLA" value={0} />
                                <Tab label="By LTLA" value={1} />
                            </Tabs>
                        </Box>
                        {/* {chartMode === 0 ?  */}
                        <Box>
                            <FormControlLabel
                                classes={{label: classes.label}}
                                control={<Switch checked={true} name="increase" />}
                                label="Show case increase/decrease"
                                labelPlacement="start"
                            />
                        </Box>
                        {/* <Box>
                        <FormControlLabel
                            classes={{label: classes.label}}
                            control={<Switch checked={showLogarithmic} onChange={(event, newValue) => setShowLogarithmic(newValue)} name="logarithmic" />}
                            label="Show logarithmic axes"
                            labelPlacement="start"
                        />
                        </Box> */}
                        {/* } */}

                    </Box>
                    
                    <Map center={position} zoom={state.zoom} ref={mapRef} className={classes.map}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    </Map>
                </Box>
            </CardContent>
        </Card>
      
    )
}

export default CaseMap
