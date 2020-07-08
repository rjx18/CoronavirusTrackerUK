import { useState, useEffect } from 'react';
import axios from 'axios';
import LtlaMap from './LtlaMap';

const CASES_URL = "https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json";

export const useFetch = () => {
    const [state, setState] = useState({data: null, isFetching: true});

    useEffect(() => {
        console.log("Fetching data...");
        const fetchData = async () => {
            let [cases_old] = await Promise.all([
                axios({
                    url: CASES_URL,
                    method: "GET",
                }),
            ]);

            const cases = {
                ltlas: cases_old.data.ltlas,
                utlas: cases_old.data.utlas,
            }

            // Only include England areas
            const parsedLtlaMap = {
                ...LtlaMap, 
                features: LtlaMap.features.filter((e) => {
                    return e.properties.areaCode.charAt(0) === 'E';
                })
            }

            setState({
                data: {
                    ltlaMap: parsedLtlaMap,
                    cases: cases.ltlas
                }, 
                isFetching: false
            });
        }

        fetchData();
    }, [])

    return state;
}

export default useFetch;