import React from 'react';
import useFetch from './useFetch';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useCallback, useEffect } from 'react';
import { Box, CircularProgress } from '@material-ui/core';

function DataControl() {
    const {data, isLoading} = useFetch();

    return (
        isLoading ? 
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box> 
            : 
            <Box>
                {/* <Box className={classes.filterBox}> 
                    <Filter handleSelect={handleSelect} utla={data.utla} ltla={data.ltla}/>
                </Box>

                <Chart regionCases={selectedCases} /> */}
            </Box>
    )
}

export default DataControl
