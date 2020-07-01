import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useCallback } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const useStyles = makeStyles((theme) => ({
    authoritySelect: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    regionSelect: {
        margin: theme.spacing(1),
        minWidth: 200,
        maxWidth: 600,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function Filter({handleSelect, utla, ltla}) {
    const classes = useStyles();
    const [authority, setAuthority] = React.useState(2);
    const [region, setRegion] = React.useState([]);

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
                    return UK_COUNTRIES;
                case 2:
                    return UK_REGIONS;
                case 3:
                    return utla;
                case 4:
                    return ltla;
                default:
                    return null;
            }
        },
        [authority, utla, ltla],
    )

    useEffect(() => handleSelect(region, authority), [region, authority, handleSelect] )

    useEffect(() => { setRegion([]); }, [authority, getRegionCodes]);
    
    return (
        <Box display="flex">
            <Box>
                <FormControl className={classes.authoritySelect}>
                    <Select
                    labelId="authority-select"
                    id="authority-select"
                    value={authority}
                    onChange={handleAuthoritySelect}
                    variant='outlined'
                    >
                        <MenuItem value={1}>By Country</MenuItem>
                        <MenuItem value={2}>By Region</MenuItem>
                        <MenuItem value={3}>By UTLA</MenuItem>
                        <MenuItem value={4}>By LTLA</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            
            <Box>
                <Autocomplete
                    multiple
                    options={getRegionCodes()}
                    getOptionLabel={(option) => option.REGIONNAME}
                    id="region-select"
                    autoHighlight
                    disableCloseOnSelect
                    openOnFocus
                    limitTags={1}
                    value={region}
                    onChange={(event, regionSelected) => setRegion(regionSelected)}
                    renderOption={(option, { selected }) => (
                        <React.Fragment>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.REGIONNAME}
                        </React.Fragment>
                      )}
                    renderInput={(params) => 
                        <TextField {...params} 
                        className={classes.regionSelect} 
                        label="Select regions" 
                        margin="normal" 
                        variant="outlined" 
                        />}
                />
            </Box>
        </Box>
    )
}

const UK_COUNTRIES = [
    {
        REGIONCODE: "E92000001",
        REGIONNAME: "England"
    }, 
]

const UK_REGIONS = [
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
