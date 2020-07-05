import { useState, useEffect } from 'react';
import axios from 'axios';

const CASES_URL = "https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json";
const LTLA_MAP = "https://opendata.arcgis.com/datasets/8edafbe3276d4b56aec60991cbddda50_4.geojson";
const UTLA_MAP = "https://opendata.arcgis.com/datasets/687f346f5023410ba86615655ff33ca9_3.geojson";

export const useFetch = () => {
    const [state, setState] = useState({data: null, isLoading: true});

    useEffect(() => {
        console.log("Fetching data...");
        const fetchData = async () => {
            let [utlaMap, ltlaMap, cases_old] = await Promise.all([
                axios({
                    url: UTLA_MAP,
                    method: "GET",
                }),
                axios({
                    url: LTLA_MAP,
                    method: "GET",
                }),
                axios({
                    url: CASES_URL,
                    method: "GET",
                }),
            ]);

            const cases = {
                ltlas: cases_old.data.ltlas,
                utlas: cases_old.data.utlas,
            }

            setState({
                data: {
                    utlaMap: utlaMap.data, 
                    ltlaMap: ltlaMap.data, 
                    cases: cases
                }, 
                isLoading: false
            });
        }

        fetchData();
    }, [])

    return state;
}

export default useFetch;