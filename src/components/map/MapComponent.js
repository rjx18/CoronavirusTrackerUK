import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState, useRef } from 'react';
import { Map, GeoJSON, TileLayer, Circle,
    CircleMarker,
    // Marker,
    // Polygon,
    // Popup,
    // Rectangle,
    Tooltip, } from "react-leaflet";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import * as DateUtils from '../../DateUtils';
import L from 'leaflet';

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_COVIDTRACKER_KEY;
const MAPBOX_URL = `https://api.mapbox.com/styles/v1/richhardry/ckc8vwvno3m101iozemujego6/tiles/256/{z}/{x}/{y}@2x?access_token=${ACCESS_TOKEN}`;

const useStyles = makeStyles((theme) => ({
    map: {
        height: 550,
        width: "100%",
        borderRadius: 20,
    }
  }));

function MapComponent({geojson, casesForDate, perMillion, caseIncrease}) {
    const classes = useStyles();
    const smMedia = useMediaQuery('(max-width:700px)');

    const state = {
    lat: 52.9,
    lng: -2,
    zoom: smMedia ? 6 : 6.25,
    };

    const position = [state.lat, state.lng];

    var mapRef = useRef();

    const style = (feature) => {
        const casesForFeature = casesForDate.cases.find((e) => {return e.areaCode === feature.properties.areaCode});
        
        if (casesForFeature) {
            //console.log(casesForFeature.casesPerMillion);
            return {
                fillColor: 'hsl(345, 100%, 50%)',
                weight: 1,
                opacity: 1,
                color: '#8f8f8f',
                fillOpacity: perMillion ? Math.min(casesForFeature.casesPerMillion / 500, 1.0) : Math.min(casesForFeature.casesPastWeek / 200, 1.0)
                //fillOpacity: 1.0
            };
        }

        return {
            fillColor: 'red',
            weight: 1,
            opacity: 1,
            color: '#8f8f8f',
            fillOpacity: 0
        };
    }

    const onEachFeature = (feature, layer) => {
        //const popupContent = `${feature.properties.areaName}`
        var popup = L.popup({autoPan: false, closeButton: false})
            .setContent('<p>Hello world!<br />This is a nice popup.</p>')
        
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
        });
        // const popupContent = ` <Popup><p>Customizable Popups <br />with feature information.</p><pre>Borough: <br />${feature.properties.areaName}</pre></Popup>`
        // layer.bindPopup(popupContent)
    }

    useEffect(() => {
        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.leafletElement.invalidateSize();
            }
        }, 100);
    }, []);

   

    return (
        <Map center={position} zoom={state.zoom} ref={mapRef} className={classes.map} zoomSnap={0.25}>
            <TileLayer
                url={MAPBOX_URL}
                attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
            />
            <GeoJSON key={(casesForDate) ? `geojson-${DateUtils.dateToString(casesForDate.date)}` : `geojson-null`} data={geojson} style={style} onEachFeature={onEachFeature} />
        </Map>
    )
}

export default MapComponent
