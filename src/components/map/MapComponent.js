import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useRef } from 'react';
import { Map, GeoJSON, TileLayer } from "react-leaflet";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import * as DateUtils from '../../DateUtils';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import Typography from '@material-ui/core/Typography';
import './MapComponent.css'

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_COVIDTRACKER_KEY;
const MAPBOX_URL = `https://api.mapbox.com/styles/v1/richhardry/ckc8vwvno3m101iozemujego6/tiles/256/{z}/{x}/{y}@2x?access_token=${ACCESS_TOKEN}`;

const useStyles = makeStyles((theme) => ({
    map: {
        height: 550,
        width: "100%",
        borderRadius: 20,
    },
    popupStats: {
        color: "#ab003c"
    },
    
  }));

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  };

function MapComponent({geojson, casesForDate, perMillion, caseIncrease, mapMode, history}) {
    const classes = useStyles();
    const smMedia = useMediaQuery('(max-width:700px)');

    const state = {
    lat: 52.9,
    lng: -2,
    zoom: smMedia ? 6 : 6.5,
    };

    const position = [state.lat, state.lng];

    var mapRef = useRef();

    const formatPopulation = (x) => {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    const formatIncrease = (x) => {
        return (x >= 0) ? "+" + x : x;
    }

    const style = (feature) => {
        const casesForFeature = casesForDate.cases.find((e) => {return e.areaCode === feature.properties.areaCode});
        
        var fillColor = {
            h: 345,
            s: 100,
            l: 50
        }

        var fillOpacity = 0;

        if (casesForFeature) {
            if (mapMode === 0) {
                if (perMillion) {
                    if (casesForFeature.cumCasesPerMillion <= 8000) {
                        fillOpacity = Math.min(casesForFeature.cumCasesPerMillion / 8000, 1.0);
                    } else {
                        fillOpacity = 1.0;
                        fillColor = {
                            ...fillColor,
                            l: 50 - (casesForFeature.cumCasesPerMillion - 8000) / 500
                        }
                    }
                    
                } else {
                    fillOpacity = Math.min(casesForFeature.cumulativeCases / 3000, 1.0);
                }
            } else {
                if (perMillion) {
                    fillOpacity = Math.min(casesForFeature.casesPerMillion / 500, 1.0);

                    if (caseIncrease) {
                        fillColor = {
                            h: clamp(10, 110 - casesForFeature.caseIncreasePerMillion, 210),
                            s: 100,
                            l: 50,
                        };
                    } 
                } else {
                    fillOpacity = Math.min(casesForFeature.casesPastWeek / 200, 1.0);
                    if (caseIncrease) {
                        fillColor = {
                            h: clamp(10, 110 - casesForFeature.caseIncrease * 5, 210),
                            s: 100,
                            l: 50,
                        };
                    }
                }
            }
            
        }

        return {
            fillColor: `hsl(${fillColor.h}, ${fillColor.s}%, ${fillColor.l}%)`,
            weight: 1,
            opacity: 1,
            color: '#8f8f8f',
            fillOpacity: fillOpacity
        };
    }

    const onEachFeature = (feature, layer) => {
        var casesForFeature = casesForDate.cases.find((e) => {return e.areaCode === feature.properties.areaCode});
        var popup;
        if (!casesForFeature) {
            popup = L.popup({autoPan: false, closeButton: false})
                .setContent(`<div>${ReactDOMServer.renderToString(
                    <>
                    <Typography variant="h6" component="h6">
                        <b>{feature.properties.areaName}</b>
                    </Typography>
                    <Typography className={classes.popupText} variant="h6" component="h6">
                        No recorded data.
                    </Typography>
                    </>
                )}</div>`);
        } else {
            const popupSubValueClass = casesForFeature.caseIncrease > 0 ? "popupSubValuePos" : "popupSubValueNeg";
            const popupSubValueLabelClass = casesForFeature.caseIncrease > 0 ? "popupSubValueLabelPos" : "popupSubValueLabelNeg";
            popup = L.popup({autoPan: false, closeButton: false})
            .setContent(`
            <div class="popup-container">
                <div class="popup-section">
                    <span class="popup-content popupTitle">${feature.properties.areaName}</span>
                    <br>
                    <span class="popup-content popupLabel" >Pop. ${formatPopulation(casesForFeature.population)} </span>
                </div>
                <div class="popup-anim-container">
                    <div class="popup-normal">
                        <div class="popup-section-pl">
                            <span class="popup-content popupLabel" >Weekly new cases</span>
                            <br>
                            <span class="popup-content popupValue" >${casesForFeature.casesPastWeek}&nbsp;</span>
                            <span class="popup-content ${popupSubValueClass}" >${formatIncrease(casesForFeature.caseIncrease)}</span>
                            <span class="popup-content ${popupSubValueLabelClass}" >from last week</span>
                        </div>
                        <div>
                            <span class="popup-content popupLabel" >Cumulative cases</span>
                            <br>
                            <span class="popup-content popupValue" >${casesForFeature.cumulativeCases}</span>
                        </div>
                    </div>
                    <div class="popup-permillion">
                        <div class="popup-section">
                            <span class="popup-content popupLabel" >Weekly new cases (per mil)</span>
                            <br>
                            <span class="popup-content popupValue" >${casesForFeature.casesPerMillion.toFixed(1)}&nbsp;</span>
                            <br>
                            <div class="popup-new-cases">
                                <span class="popup-content ${popupSubValueClass}" >${formatIncrease(casesForFeature.caseIncreasePerMillion.toFixed(1))}</span>
                                <span class="popup-content ${popupSubValueLabelClass}" >from last week</span>
                            </div>
                        </div>
                        <div>
                            <span class="popup-content popupLabel" >Cumulative cases (per mil)</span>
                            <br>
                            <span class="popup-content popupValue" >${casesForFeature.cumCasesPerMillion.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                
                
            </div>`)
        }

        /*
        data = [{
            date: ...,
            cases: [
                {
                    areaName: ...,
                    areaCode: ...,
                    population: ...,
                    caseIncrease: ..., = increase/decrease from yesterday
                    casesPastWeek: ...,
                    casesPerMillion: ...,
                    caseIncreasePerMillion: ...
                }
            ]
        }]
        */

        layer.bindPopup(popup);
        layer.on({
            mouseover: ((e) => {
                var popup = e.target.getPopup();
                popup.setLatLng(e.latlng).openOn(mapRef.current.leafletElement);
            }),
            mouseout: ((e) => {
                e.target.closePopup();
            }),
            mousemove: ((e) => {
                var popup = e.target.getPopup();
                popup.setLatLng(e.latlng).openOn(mapRef.current.leafletElement);
            }),
            click: ((e) => {
                history.push(`/cases?type=ltlas&regions=${feature.properties.areaCode}`);
            })
        });
    }

    useEffect(() => {
        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.leafletElement.invalidateSize();
            }
        }, 100);
    }, []);

    return (
        <Map center={position} zoom={state.zoom} ref={mapRef} className={classes.map} zoomSnap={0.5}>
            <TileLayer
                url={MAPBOX_URL}
                attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
            />
            <GeoJSON key={(casesForDate) ? `geojson-${DateUtils.dateToString(casesForDate.date)}` : `geojson-null`} data={geojson} style={style} onEachFeature={onEachFeature} />
        </Map>
    )
}

export default MapComponent

// ${ReactDOMServer.renderToString(
//     <>
//     <Box>
//         <Box pb={1.5}>
//             <Typography className={classes.popupTitle} variant="h6" component="h6">
//                 <b>{feature.properties.areaName}</b>
//             </Typography>
//             <Typography className={classes.popupLabel} variant="subtitle2" component="subtitle2">
//                 Pop. {casesForFeature.population}
//             </Typography>
//         </Box>
//         <Box pb={1.5}>
//             <Typography className={classes.popupLabel} variant="subtitle2" component="subtitle2">
//                 Weekly new cases
//             </Typography>
//             <br />
//             <Typography className={classes.popupValue} variant="subtitle2" component="subtitle2">
//                 24&nbsp;
//             </Typography>
//             <Typography className={classes.popupSubValueNeg} variant="subtitle2" component="subtitle2">
//                 -23&nbsp;
//             </Typography>
//             <Typography className={classes.popupSubValueLabelNeg} variant="subtitle2" component="subtitle2">
//                 from last week
//             </Typography>
//         </Box>
//         <Box>
//             <Typography className={classes.popupLabel} variant="subtitle2" component="subtitle2">
//                 Cumulative cases
//             </Typography>
//             <br />
//             <Typography className={classes.popupValue} variant="subtitle2" component="subtitle2">
//                 342
//             </Typography>
//         </Box>
//     </Box>
//     {/* <Typography variant="h6" component="h6">
//         <b>{feature.properties.areaName}</b>
//     </Typography>
//     <Typography variant="subtitle2" component="subtitle2">
//         Weekly new cases:&nbsp;
//     </Typography>
//     <Typography className={classes.popupStats} variant="subtitle2" component="subtitle2">
//         <b>{casesForFeature.casesPastWeek}</b>
//     </Typography>
//     <br/>
//     <Typography variant="subtitle2" component="subtitle2">
//         Change in weekly cases from last week:&nbsp;
//     </Typography>
//     <Typography className={classes.popupStats} variant="subtitle2" component="subtitle2">
//         <b>{casesForFeature.caseIncrease}</b>
//     </Typography>
//     <br/>
//     <Typography variant="subtitle2" component="subtitle2">
//         Weekly new cases per million:&nbsp;
//     </Typography>
//     <Typography className={classes.popupStats} variant="subtitle2" component="subtitle2">
//         <b>{casesForFeature.casesPerMillion.toFixed(2)}</b>
//     </Typography>
//     <br/>
//     <Typography variant="subtitle2" component="subtitle2">
//         Change in weekly cases per million:&nbsp;
//     </Typography>
//     <Typography className={classes.popupStats} variant="subtitle2" component="subtitle2">
//         <b>{casesForFeature.caseIncreasePerMillion.toFixed(2)}</b>
//     </Typography>
//     <br/>
//     <Typography variant="subtitle2" component="subtitle2">
//         Population:&nbsp;
//     </Typography>
//     <Typography className={classes.popupStats} variant="subtitle2" component="subtitle2">
//         <b>{casesForFeature.population}</b>
//     </Typography>
//     <br/>
//     <Typography variant="subtitle2" component="subtitle2">
//         Cumulative cases:&nbsp;
//     </Typography>
//     <Typography className={classes.popupStats} variant="subtitle2" component="subtitle2">
//         <b>{casesForFeature.cumulativeCases}</b>
//     </Typography>
//     <br/>
//     <Typography variant="subtitle2" component="subtitle2">
//         Cumulative cases per million:&nbsp;
//     </Typography>
//     <Typography className={classes.popupStats} variant="subtitle2" component="subtitle2">
//         <b>{casesForFeature.cumCasesPerMillion.toFixed(2)}</b>
//     </Typography> */}
//     </>
// )}