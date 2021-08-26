import { useAppConfig } from './config.context';
import { Accordion, AccordionDetails } from '@material-ui/core';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

export const RawConfig = () => {
    const { appConfig } = useAppConfig();

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>JSON config view</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {JSON.stringify(appConfig, null, 4)}
            </AccordionDetails>
        </Accordion>
    );
};
