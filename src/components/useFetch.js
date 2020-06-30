import { useState, useEffect } from 'react';
import axios from 'axios';

const CASES_URL = "https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json";
const LTLA_URL = "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/LTLA19_UTLA19_EW_LU/FeatureServer/0/query?where=LTLA19CD%20LIKE%20%27E%%27&outFields=LTLA19CD,LTLA19NM&returnDistinctValues=true&outSR=4326&f=json";
const UTLA_URL = "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/LTLA19_UTLA19_EW_LU/FeatureServer/0/query?where=LTLA19CD%20LIKE%20%27E%%27&outFields=UTLA19CD,UTLA19NM&returnDistinctValues=true&outSR=4326&f=json";

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
            let [utla, ltla, cases] = await Promise.all([
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
            ]);
            console.log("Retrieved data summary: " + JSON.stringify(cases.data.dailyRecords));

            const parsedCases = {...cases.data, regions: cases.data.regions.concat(cases.data.countries)};

            const parsedUtla = utla.data.features.map((d, idx) => {
                return {REGIONCODE: d.attributes.UTLA19CD, REGIONNAME: d.attributes.UTLA19NM};
            }).sort(sortRegions);

            const parsedLtla = ltla.data.features.map((d, idx) => {
                return {REGIONCODE: d.attributes.LTLA19CD, REGIONNAME: d.attributes.LTLA19NM};
            }).sort(sortRegions);

            setState({
                data: {
                    utla: parsedUtla, 
                    ltla: parsedLtla, 
                    cases: parsedCases
                }, isLoading: false
            });
        }

        fetchData();
    }, [])

    return state;
}

export default useFetch;