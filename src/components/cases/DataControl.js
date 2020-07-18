import React from 'react';
import useFetch from './useFetch';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useCallback, useEffect } from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { withRouter } from "react-router-dom";
import Filter from './Filter';
import Chart from './Chart';
import qs from 'qs';

const useStyles = makeStyles((theme) => ({
    filterBox: {
        marginBottom: 10,
    }
  }));

function DataControl(props) {
    const classes = useStyles();

    const {data, isLoading} = useFetch();

    const [selectedAuthority, setSelectedAuthority] = useState("countries");

    const [selectedRegions, setSelectedRegions] = useState([]);

    const [selectedCases, setSelectedCases] = useState([]);

    useEffect(() => {
        if (data) {
            const selectedAuthorityURL = qs.parse(props.location.search, { ignoreQueryPrefix: true }).type;
            if (selectedAuthorityURL) {
                setSelectedAuthority(selectedAuthorityURL);
            }
            const selectedRegionsQuery = qs.parse(props.location.search, { ignoreQueryPrefix: true }).regions;
            if (selectedRegionsQuery) {
                const selectedRegionsNames = selectedRegionsQuery.split(',');
                switch (selectedAuthorityURL) {
                    case "countries":
                        setSelectedRegions(selectedRegionsNames.map((query) => {return data.countries.find((e) => e.REGIONCODE === query)}));
                        break;
                    case "regions":
                        setSelectedRegions(selectedRegionsNames.map((query) => {return data.regions.find((e) => e.REGIONCODE === query)}));
                        break;
                    case "utlas":
                        setSelectedRegions(selectedRegionsNames.map((query) => {return data.utlas.find((e) => e.REGIONCODE === query)}));
                        break;
                    case "ltlas":
                        setSelectedRegions(selectedRegionsNames.map((query) => {return data.ltlas.find((e) => e.REGIONCODE === query)}));
                        break;
                    default:
                        break;
                }
            } else {
                setSelectedRegions([]);
            }
        }
    }, [data, props.location.search])

    const filterRegion = useCallback((regions, authority) => {
        if (!data) {
            return [];
        }

        var cases = [];

        switch (authority) {
            case "countries":
                cases = data.cases.countries;
                break;
            case "regions":
                cases = data.cases.regions;
                break;
            case "utlas":
                cases = data.cases.utlas;
                break;
            case "ltlas":
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

        console.log("FilteredList: " + filteredList);

        return filteredList;

        // const regionCodeList = regions.map((d, idx) => {
        //     return d.REGIONCODE;
        // })

        // return cases.filter((c) => {
        //     return regionCodeList.includes(c.areaCode);
        // });
    }, [data])

    const handleSelect = (authority, region) => {
        console.log("Selected authority: " + authority);
        console.log("Selected region: " + JSON.stringify(region));
        props.history.push(`/cases?type=${authority}${region.length !== 0 ? "&regions=" + region.map((e) => e.REGIONCODE).join() : ""}`);
        setSelectedRegions(region);
    };

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
                    <Filter handleSelect={handleSelect} utlas={data.utlas} ltlas={data.ltlas} countries={data.countries} regions={data.regions} selectedAuthority={selectedAuthority} selectedRegions={selectedRegions}/>
                </Box>
                <Chart regionCases={selectedCases} />
            </Box>
    )
}

export default withRouter(DataControl)
