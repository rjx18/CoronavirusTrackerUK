import { useState, useEffect } from 'react';
import axios from 'axios';
import LtlaMap from './LtlaMap';

const CASES_URL = "https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json";
const LTLA_URL = "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/LTLA19_UTLA19_EW_LU/FeatureServer/0/query?where=LTLA19CD%20LIKE%20%27E%%27&outFields=LTLA19CD,LTLA19NM&returnDistinctValues=true&outSR=4326&f=json";

const REGIONS_NOT_INCLUDED = ['E09000001'];

export const useFetch = () => {
    const [state, setState] = useState({data: null, isFetching: true});

    useEffect(() => {
        console.log("Fetching data...");
        const fetchData = async () => {
            let [cases_old, ltla] = await Promise.all([
                axios({
                    url: CASES_URL,
                    method: "GET",
                }),
                axios({
                    url: LTLA_URL,
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

            const parsedLtlaList = ltla.data.features.map((d, idx) => {
                return {REGIONCODE: d.attributes.LTLA19CD, REGIONNAME: d.attributes.LTLA19NM};
            }).filter((e) => {return !REGIONS_NOT_INCLUDED.includes(e.REGIONCODE)});

            setState({
                data: {
                    ltlaMap: parsedLtlaMap,
                    cases: cases.ltlas,
                    ltlaList: parsedLtlaList
                }, 
                isFetching: false
            });
        }

        fetchData();
    }, [])

    return state;
}

export default useFetch;