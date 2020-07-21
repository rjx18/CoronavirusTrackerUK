import { useState, useEffect } from 'react';
import axios from 'axios';
import LtlaMap from './LtlaMap';
import * as Globals from '../Globals';

export const useFetch = () => {
    const [state, setState] = useState({data: null, isFetching: true, isError: false});

    useEffect(() => {
        console.log("Fetching data...");
        const fetchData = async () => {
            await Promise.all([
                axios({
                    url: Globals.CASES_URL,
                    method: "GET",
                }),
                axios({
                    url: Globals.LTLA_URL,
                    method: "GET",
                }),
            ]).then((res) => {
                let [cases_old, ltla] = res;

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
    
                const parsedLtlaList = ltla.data.features.map((d, idx) => {
                    return {REGIONCODE: d.attributes.LTLA19CD, REGIONNAME: d.attributes.LTLA19NM};
                }).filter((e) => {return !Globals.REGIONS_NOT_INCLUDED.includes(e.REGIONCODE)});
    
                setState({
                    data: {
                        ltlaMap: parsedLtlaMap,
                        cases: cases.ltlas,
                        ltlaList: parsedLtlaList
                    }, 
                    isFetching: false,
                    isError: false
                });
            }).catch((err) => {
                setState({data: null, isFetching: false, isError: true}); 
            });
        }

        fetchData();
    }, [])

    return state;
}

export default useFetch;