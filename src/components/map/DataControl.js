import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import useFetch from './useFetch';
import { Box, CircularProgress } from '@material-ui/core';
import CaseMap from './CaseMap';
import { populationData } from './Population';
import  * as DateUtils from '../../DateUtils';

function DataControl() {
    const {data, isFetching} = useFetch();
    const [mapMode, setMapMode] = useState(1) // 0 = Cumulative, 1 = Daily
    const [mapCases, setMapCases] = useState([]);
    //const [isLoading, setIsLoading] = useState(true);
    
    // const getCases = useCallback(
    //     () => {
    //         if (data) {
    //             switch (mapMode) {
    //                 case 0:
    //                     return data.cases.utlas;
    //                 case 1:
    //                     return data.cases;
    //                 default:
    //                     break;
    //             }
    //         }
    //         return null;
    //     }, [mapMode, data]
    // )

    // const getMap = useCallback(
    //     () => {
    //         if (data) {
    //             switch (mapMode) {
    //                 case 0:
    //                     return data.utlaMap;
    //                 case 1:
    //                     return data.ltlaMap;
    //                 default:
    //                     break;
    //             }
    //         }
    //         return null;
    //     }, [mapMode, data]
    // )

    /* Date processing */

    const getLastUpdateDate = useCallback(
        () => {
            return data.cases[0].specimenDate;
        },
        [data],
    )

    /* Map processing */

    useEffect(() => {
        if (data) {
            const numDays = DateUtils.getNumDatesBetween(
                DateUtils.stringToDate(getLastUpdateDate()), 
                DateUtils.getMapInitialDate())

            var mapCaseData = new Array(numDays).fill(null);

            // Fill in the dates
            for (var i = 0; i <= numDays; i++) {
                mapCaseData[i] = {
                    date: DateUtils.incrementDateBy(DateUtils.getMapInitialDate(), i),
                    cases: []
                }
            }

            // Fill in case data
            for (i = 0; i < data.cases.length; i++) {
                const currCase = data.cases[i];
                for (var day = 0; day < 7; day++) {
                    const currActualDate = DateUtils.incrementDateBy(DateUtils.stringToDate(currCase.specimenDate), day);
                    const index = DateUtils.getNumDatesBetween(currActualDate, DateUtils.getMapInitialDate());

                    //console.log("Index: " + index);
                    if (index < mapCaseData.length) {
                        var casesOnDateForArea = mapCaseData[index].cases.find((e) => e.areaCode === currCase.areaCode);
                        if (casesOnDateForArea) {
                            casesOnDateForArea.casesPastWeek += currCase.dailyLabConfirmedCases;
                        } else {
                            mapCaseData[index].cases.push({
                                areaName: currCase.areaName,
                                areaCode: currCase.areaCode,
                                casesPastWeek: currCase.dailyLabConfirmedCases,
                                cumulativeCases: currCase.totalLabConfirmedCases
                            });
                        }
                    }
                }
            }

            // Parse additional case data
            for (day = 0; day < mapCaseData.length; day++) {
                for (var j = 0; j < mapCaseData[day].cases.length; j++) {
                    const currCase = mapCaseData[day].cases[j];
                    const currCaseAreaCode = currCase.areaCode;
                    var caseIncrease = 0;
                    if (day >= 7) {
                        const casesYesterday = mapCaseData[day - 7].cases.find((e) => e.areaCode === currCaseAreaCode);
                        if (casesYesterday) {
                            caseIncrease = currCase.casesPastWeek - casesYesterday.casesPastWeek;
                        }
                    }

                    const population = populationData.find((e) => e.areaCode === currCaseAreaCode).population;

                    const casesPerMillion = currCase.casesPastWeek / (population / 1000000)
                    const caseIncreasePerMillion = caseIncrease / (population / 1000000)
                    mapCaseData[day].cases[j] = {
                         ...currCase, 
                         population: population, 
                         caseIncrease: caseIncrease, 
                         casesPerMillion: casesPerMillion, 
                         caseIncreasePerMillion: caseIncreasePerMillion 
                    };
                }
            }

            setMapCases(mapCaseData);
        }
    }, [getLastUpdateDate, data])

    /*
    data = [{
        date: ...,
        cases: [
            {
                areaName: ...,
                areaCode: ...,
                population: ...,
                caseIncrease: ..., = increase/decrease from yesterday
                casesPastWeek: ...,
                casesPerMillion: ...,
                caseIncreasePerMillion: ...
                cumulativeCases: ...
            }
        ]
    }]
    */

    return (
        isFetching ? 
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box> 
            : 
            <Box>
                <CaseMap 
                    mapCases={mapCases} 
                    mapGeoJson={data.ltlaMap} 
                    mapMode={mapMode} 
                    handleMapModeChange={setMapMode} 
                    latestDate={DateUtils.stringToDate(getLastUpdateDate())}/>
                {/* <Box className={classes.filterBox}> 
                    <Filter handleSelect={handleSelect} utla={data.utla} ltla={data.ltla}/>
                </Box>

                <Chart regionCases={selectedCases} /> */}
            </Box>
    )
}

export default DataControl
