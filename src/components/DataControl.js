import React from 'react';
import useFetch from './useFetch';
import { useState, useCallback } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import Filter from './Filter';
import Chart from './Chart';

function DataControl() {
    const {data, isLoading} = useFetch();

    const [selectedRegion, setSelectedRegion] =  useState(null);

    const handleSelect = useCallback((region) => {
        console.log("Selected region: " + JSON.stringify(region));
        setSelectedRegion(region);
    }, [])

    return (
        isLoading ? 
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box> 
            : 
            <Box>
                <Filter handleSelect={handleSelect} utla={data.utla} ltla={data.ltla}/>
                <Chart region={selectedRegion} />
            </Box>
    )
}

export default DataControl
