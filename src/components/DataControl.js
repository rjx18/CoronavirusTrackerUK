import React from 'react';
import useFetch from './useFetch';
import { useState, useCallback, useEffect } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import Filter from './Filter';
import Chart from './Chart';

function DataControl() {
    const {data, isLoading} = useFetch();

    const [selectedAuthority, setSelectedAuthority] =  useState(0);

    const [selectedRegion, setSelectedRegion] =  useState(null);

    const [selectedCases, setSelectedCases] = useState([]);

    const handleSelect = useCallback((region, authority) => {
        console.log("Selected authority: " + authority);
        console.log("Selected region: " + JSON.stringify(region));
        setSelectedAuthority(authority);
        setSelectedRegion(region);
    }, []);

    const filterRegion = useCallback((region, authority) => {
        if (!data) {
            return [];
        }
        var cases;
        switch (authority) {
            case 1:
                cases = data.cases.regions;
                break;
            case 2:
                cases = data.cases.utlas;
                break;
            case 3:
                cases = data.cases.ltlas;
                break;
            default:
                return [];
        }

        return cases.filter((c) => {
            return c.areaCode === region.REGIONCODE;
        });
    }, [data])

    useEffect(() => {
        if (selectedRegion && selectedAuthority) {
            setSelectedCases(filterRegion(selectedRegion, selectedAuthority));
        }
    }, [selectedRegion, selectedAuthority, filterRegion])

    return (
        isLoading ? 
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box> 
            : 
            <Box>
                <Filter handleSelect={handleSelect} utla={data.utla} ltla={data.ltla}/>
                <Chart cases={selectedCases} />
            </Box>
    )
}

export default DataControl
