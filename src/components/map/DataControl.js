import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import useFetch from './useFetch';
import { Box, CircularProgress } from '@material-ui/core';
import CaseMap from './CaseMap';
import { populationData } from './Population';
import  * as DateUtils from '../../DateUtils';

function DataControl(props) {
    const {data, isFetching} = useFetch();
    const [mapMode, setMapMode] = useState(1) // 0 = Cumulative, 1 = Daily
    const [mapCases, setMapCases] = useState([]);

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

            // Add in missing case data where there are 0 cases for that week
            for (day = 1; day < mapCaseData.length; day++) {
                const ltlaList = Array.from(data.ltlaList);
                for (var j = 0; j < mapCaseData[day].cases.length; j++) {
                    const currCaseAreaCode = mapCaseData[day].cases[j].areaCode;
                    const currIndex = ltlaList.findIndex((e) => {return e.REGIONCODE === currCaseAreaCode});
                    ltlaList.splice(currIndex, 1);
                }

                for (j = 0; j < ltlaList.length; j++) {
                    const casesLeftOut = ltlaList[j];
                    //console.log("Day: " + day + ", region: " + JSON.stringify(casesLeftOut));
                    const prevDayData = mapCaseData[day - 1].cases.find((e) => {return e.areaCode === casesLeftOut.REGIONCODE});
                    if (prevDayData) {
                        mapCaseData[day].cases.push({
                            ...prevDayData,
                            casesPastWeek: 0,
                        });
                    }
                }
            }


            // Parse additional case data
            for (day = 0; day < mapCaseData.length; day++) {
                for (j = 0; j < mapCaseData[day].cases.length; j++) {
                    const currCase = mapCaseData[day].cases[j];
                    const currCaseAreaCode = currCase.areaCode;
                    var caseIncrease = 0;
                    if (day >= 7) {
                        const casesYesterday = mapCaseData[day - 7].cases.find((e) => e.areaCode === currCaseAreaCode);
                        if (casesYesterday) {
                            caseIncrease = currCase.casesPastWeek - casesYesterday.casesPastWeek;
                        }
                    }

                    const populationContainer = populationData.find((e) => e.areaCode === currCaseAreaCode);

                    if (!populationContainer) {
                        console.log(JSON.stringify(currCase));
                    }
                    const population = populationContainer.population;

                    const casesPerMillion = currCase.casesPastWeek / (population / 1000000)
                    const caseIncreasePerMillion = caseIncrease / (population / 1000000)
                    const cumCasesPerMillion = currCase.cumulativeCases / (population / 1000000);
                    mapCaseData[day].cases[j] = {
                         ...currCase, 
                         population: population, 
                         caseIncrease: caseIncrease, 
                         casesPerMillion: casesPerMillion, 
                         caseIncreasePerMillion: caseIncreasePerMillion,
                         cumCasesPerMillion: cumCasesPerMillion
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
                    latestDate={DateUtils.stringToDate(getLastUpdateDate())}
                    history={props.history}/>
                {/* <Box className={classes.filterBox}> 
                    <Filter handleSelect={handleSelect} utla={data.utla} ltla={data.ltla}/>
                </Box>

                <Chart regionCases={selectedCases} /> */}
            </Box>
    )
}

export default DataControl
