import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Paper from "@material-ui/core/Paper";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Paper elevation={3} >
                    <Box p={3} mt={2}>
                        {children}
                    </Box>
                </Paper>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export {TabPanel};
