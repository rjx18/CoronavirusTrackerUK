import { useState, useEffect } from 'react';
import axios from 'axios';

const CASES_URL = "https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json";
const LTLA_URL = "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/LTLA19_UTLA19_EW_LU/FeatureServer/0/query?where=LTLA19CD%20LIKE%20%27E%%27&outFields=LTLA19CD,LTLA19NM&returnDistinctValues=true&outSR=4326&f=json";
const UTLA_URL = "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/LTLA19_UTLA19_EW_LU/FeatureServer/0/query?where=LTLA19CD%20LIKE%20%27E%%27&outFields=UTLA19CD,UTLA19NM&returnDistinctValues=true&outSR=4326&f=json";
const CASES_STAGING_URL = "https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&structure=%7B%22specimenDate%22:%22date%22,%22areaType%22:%22areaType%22,%22dailyLabConfirmedCases%22:%22newCasesByPublishDate%22,%22totalLabConfirmedCases%22:%22cumCasesByPublishDate%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22%7D&format=json";

const REGIONS_NOT_INCLUDED = ['E09000001'];

export const useFetch = () => {
    const [state, setState] = useState({data: null, isLoading: true});

    const sortRegions = (a, b) => {
        if ( a.REGIONNAME < b.REGIONNAME ){
            return -1;
          }
          if ( a.REGIONNAME > b.REGIONNAME ){
            return 1;
          }
          return 0;
    }

    useEffect(() => {
        console.log("Fetching data...");
        const fetchData = async () => {
            let [utla, ltla, cases_old, cases_staging] = await Promise.all([
                axios({
                    url: UTLA_URL,
                    method: "GET",
                }),
                axios({
                    url: LTLA_URL,
                    method: "GET",
                }),
                axios({
                    url: CASES_URL,
                    method: "GET",
                }),
                axios({
                    url: CASES_STAGING_URL,
                    method: "GET",
                }),

            ]);

            //Parse new staging cases data
            const cases = {
                ltlas: cases_old.data.ltlas,
                utlas: cases_old.data.utlas,
                regions: cases_old.data.regions,
                countries: cases_staging.data.data
            }

            const parsedUtla = utla.data.features.map((d, idx) => {
                return {REGIONCODE: d.attributes.UTLA19CD, REGIONNAME: d.attributes.UTLA19NM};
            }).filter((e) => {return !REGIONS_NOT_INCLUDED.includes(e.REGIONCODE)}).sort(sortRegions);

            const parsedLtla = ltla.data.features.map((d, idx) => {
                return {REGIONCODE: d.attributes.LTLA19CD, REGIONNAME: d.attributes.LTLA19NM};
            }).filter((e) => {return !REGIONS_NOT_INCLUDED.includes(e.REGIONCODE)}).sort(sortRegions);

            setState({
                data: {
                    countries: UK_COUNTRIES,
                    regions: UK_REGIONS,
                    utlas: parsedUtla, 
                    ltlas: parsedLtla, 
                    cases: cases
                }, isLoading: false
            });
        }

        fetchData();
    }, [])

    return state;
}

const UK_COUNTRIES = [
    {
        REGIONCODE: "E92000001",
        REGIONNAME: "England",
    }, 
    {
        REGIONCODE: "N92000002",
        REGIONNAME: "Northern Ireland",
    }, 
    {
        REGIONCODE: "S92000003",
        REGIONNAME: "Scotland",
    }, 
    {
        REGIONCODE: "W92000004",
        REGIONNAME: "Wales",
    }, 
]

const UK_REGIONS = [
    {
        REGIONCODE: "E12000009",
        REGIONNAME: "South West"
    }, 
    {
        REGIONCODE: "E12000008",
        REGIONNAME: "South East"
    }, 
    {
        REGIONCODE: "E12000007",
        REGIONNAME: "London"
    }, 
    {
        REGIONCODE: "E12000006",
        REGIONNAME: "East of England"
    }, 
    {
        REGIONCODE: "E12000005",
        REGIONNAME: "West Midlands"
    }, 
    {
        REGIONCODE: "E12000004",
        REGIONNAME: "East Midlands"
    }, 
    {
        REGIONCODE: "E12000003",
        REGIONNAME: "Yorkshire and The Humber"
    }, 
    {
        REGIONCODE: "E12000002",
        REGIONNAME: "North West"
    }, 
    {
        REGIONCODE: "E12000001",
        REGIONNAME: "North East"
    }, 
]

export default useFetch;