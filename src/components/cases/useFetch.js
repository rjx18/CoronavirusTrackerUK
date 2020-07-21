import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Globals from '../Globals';

export const useFetch = () => {
    const [state, setState] = useState({data: null, isLoading: true, isError: false});

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
            await Promise.all([
                axios({
                    url: Globals.UTLA_URL,
                    method: "GET",
                }),
                axios({
                    url: Globals.LTLA_URL,
                    method: "GET",
                }),
                axios({
                    url: Globals.CASES_URL,
                    method: "GET",
                }),
                axios({
                    url: Globals.CASES_STAGING_URL,
                    method: "GET",
                }),
            ]).then((res) => {
                let [utla, ltla, cases_old, cases_staging] = res;
                const cases = {
                    ltlas: cases_old.data.ltlas,
                    utlas: cases_old.data.utlas,
                    regions: cases_old.data.regions,
                    countries: cases_staging.data.data
                }
    
                const parsedUtla = utla.data.features.map((d, idx) => {
                    return {REGIONCODE: d.attributes.UTLA19CD, REGIONNAME: d.attributes.UTLA19NM};
                }).filter((e) => {return !Globals.REGIONS_NOT_INCLUDED.includes(e.REGIONCODE)}).sort(sortRegions);
    
                const parsedLtla = ltla.data.features.map((d, idx) => {
                    return {REGIONCODE: d.attributes.LTLA19CD, REGIONNAME: d.attributes.LTLA19NM};
                }).filter((e) => {return !Globals.REGIONS_NOT_INCLUDED.includes(e.REGIONCODE)}).sort(sortRegions);
    
                setState({
                    data: {
                        countries: Globals.UK_COUNTRIES,
                        regions: Globals.UK_REGIONS,
                        utlas: parsedUtla, 
                        ltlas: parsedLtla, 
                        cases: cases
                    }, 
                    isLoading: false,
                    isError: false
                });
            })
            .catch((err) => {
                setState({data: null, isLoading: false, isError: true}); 
            })
        }

        fetchData();
        
    }, [])

    return state;
}

export default useFetch;