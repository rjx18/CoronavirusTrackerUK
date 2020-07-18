import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback } from 'react';
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

function Filter({handleSelect, utlas, ltlas, countries, regions, selectedRegions, selectedAuthority}) {
    const classes = useStyles();

    const handleAuthoritySelect = (event) => {
        handleSelect(event.target.value, []);
    };

    const handleRegionSelect = (regionSelected) => {
        handleSelect(selectedAuthority, regionSelected);
    };

    const getRegionCodes = useCallback(
        () => {
            switch(selectedAuthority) {
                case "countries":
                    return countries;
                case "regions":
                    return regions;
                case "utlas":
                    return utlas;
                case "ltlas":
                    return ltlas;
                default:
                    return null;
            }
        },
        [selectedAuthority, utlas, ltlas, countries, regions],
    )

    // useEffect(() => { setRegion([]); }, [authority, getRegionCodes]);

    return (
        <Box display="flex">
            <Box>
                <FormControl className={classes.authoritySelect}>
                    <Select
                    labelId="authority-select"
                    id="authority-select"
                    value={selectedAuthority}
                    onChange={handleAuthoritySelect}
                    variant='outlined'
                    >
                        <MenuItem value={"countries"}>By Country</MenuItem>
                        <MenuItem value={"regions"}>By Region</MenuItem>
                        <MenuItem value={"utlas"}>By UTLA</MenuItem>
                        <MenuItem value={"ltlas"}>By LTLA</MenuItem>
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
                    value={selectedRegions}
                    onChange={(event, regionSelected) => handleRegionSelect(regionSelected)}
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

export default Filter
