import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useCallback } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    authoritySelect: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    regionSelect: {
        margin: theme.spacing(1),
        width: 200,

    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

function Filter({handleSelect, utla, ltla}) {
    const classes = useStyles();
    const [authority, setAuthority] = React.useState(1);
    const [region, setRegion] = React.useState(UK_REGIONS[0]);

    const handleAuthoritySelect = (event) => {
        setAuthority(event.target.value);
    };
    
    // const handleRegionSelect = (regionSelected) => {
    //     setRegion(regionSelected);
    //     handleSelect(regionSelected);
    // };

    const getRegionCodes = useCallback(
        () => {
            switch(authority) {
                case 1:
                    return UK_REGIONS;
                case 2:
                    return utla;
                case 3:
                    return ltla;
                default:
                    return null;
            }
        },
        [authority, utla, ltla],
    )

    useEffect(() => handleSelect(region, authority), [region, authority, handleSelect] )

    useEffect(() => { setRegion(getRegionCodes()[0]); }, [authority, getRegionCodes]);
    
    return (
        <Box display="flex">
            <Box>
                <FormControl className={classes.authoritySelect}>
                    <Select
                    labelId="authority-select"
                    id="authority-select"
                    value={authority}
                    onChange={handleAuthoritySelect}
                    disableUnderline={true}
                    >
                        <MenuItem value={1}>By Region</MenuItem>
                        <MenuItem value={2}>By UTLA</MenuItem>
                        <MenuItem value={3}>By LTLA</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            
            <Box>
                <Autocomplete
                    options={getRegionCodes()}
                    getOptionLabel={(option) => option.REGIONNAME}
                    id="region-select"
                    autoHighlight
                    disableClearable={true}
                    selectOnFocus={true}
                    value={region}
                    onChange={(event, regionSelected) => setRegion(regionSelected)}
                    renderInput={(params) => 
                        <TextField {...params} 
                        className={classes.regionSelect} 
                        margin="normal" 
                        InputProps={{ ...params.InputProps, ...{ disableUnderline: true }  }} 
                        />}
                />
            </Box>
        
        {/* <FormControl className={classes.regionSelect}>
            <Select
            labelId="region-select"
            id="region-select"
            value={region}
            onChange={handleRegionSelect}
            disableUnderline={true}
            >

                    getRegionCodes().map((d, idx) => {
                        return <MenuItem value={d.REGIONCODE} id={"region-select-" + idx}>{d.REGIONNAME}</MenuItem>
                    }
            </Select>
        </FormControl> */}
        </Box>
    )
}

const UK_REGIONS = [
    {
        REGIONCODE: "E92000001",
        REGIONNAME: "England - All"
    }, 
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

export default Filter
