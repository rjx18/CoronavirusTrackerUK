import React from 'react';
import useFetch from './useFetch';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useCallback, useEffect } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import Filter from './Filter';
import Chart from './Chart';

const useStyles = makeStyles((theme) => ({
    filterBox: {
        marginBottom: 10,
    }
  }));

function DataControl() {
    const classes = useStyles();

    const {data, isLoading} = useFetch();

    const [selectedAuthority, setSelectedAuthority] =  useState(0);

    const [selectedRegions, setSelectedRegions] =  useState([]);

    const [selectedCases, setSelectedCases] = useState([]);

    const handleSelect = useCallback((region, authority) => {
        console.log("Selected authority: " + authority);
        console.log("Selected region: " + JSON.stringify(region));
        setSelectedAuthority(authority);
        setSelectedRegions(region);
    }, []);

    const filterRegion = useCallback((regions, authority) => {
        if (!data) {
            return [];
        }

        var cases = [];

        switch (authority) {
            case 1:
                cases = data.cases.countries;
                break;
            case 2:
                cases = data.cases.regions;
                break;
            case 3:
                cases = data.cases.utlas;
                break;
            case 4:
                cases = data.cases.ltlas;
                break;
            default:
                return [];
        }

        var filteredList = regions.map((d, idx) => {
            return {region: d, cases: []};
        })

        for (const c of cases) {
            var region = filteredList.find((e) => e.region.REGIONCODE === c.areaCode);
            if (region) {
                region.cases.push(c);
            }
        }

        return filteredList;

        // const regionCodeList = regions.map((d, idx) => {
        //     return d.REGIONCODE;
        // })

        // return cases.filter((c) => {
        //     return regionCodeList.includes(c.areaCode);
        // });
    }, [data])

    useEffect(() => {
        if (selectedAuthority) {
            setSelectedCases(filterRegion(selectedRegions, selectedAuthority));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRegions, filterRegion])

    return (
        isLoading ? 
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box> 
            : 
            <Box>
                <Box className={classes.filterBox}> 
                    <Filter handleSelect={handleSelect} utla={data.utla} ltla={data.ltla}/>
                </Box>

                <Chart regionCases={selectedCases} />
            </Box>
    )
}

export default DataControl
