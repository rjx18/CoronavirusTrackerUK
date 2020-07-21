import React from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';

function ErrorPrompt({history}) {
    return (
        <Box>
            <Box display="flex" justifyContent="center" mb={1}>
                    <Typography variant="button"><b>Error: </b>Failed to fetch data, please refresh and try again</Typography>
            </Box>
            <Box display="flex" justifyContent="center">
                <IconButton aria-label="refresh" onClick={() => {history.go(0);}}>
                    <RefreshIcon />
                </IconButton>
            </Box>
        </Box>
    )
}

export default ErrorPrompt
