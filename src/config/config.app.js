import React, { useCallback, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { Button, NoticeBox } from '@dhis2/ui';
import { RawConfig } from './RawConfig.component';
import { useAppConfig } from './config.context';
import { ImmunizationIndicatorGroupSelector } from './ImmunizationIndicatorGroupSelect.component';
import { ImmunizationDataGroupSelector } from './ImmunizationDataGroupSelect.component';

export const ConfigApp = () => {
    const { loading, appConfig, mutate } = useAppConfig();
    const [immunizationIndicatorGroup, setImmunizationIndicatorGroup] =
        useState();
    const [immunizationDataGroup, setImmunizationDataGroup] = useState();

    useEffect(() => {
        setImmunizationIndicatorGroup(appConfig?.immunizationIndicatorGroup);
        setImmunizationDataGroup(appConfig?.immunizationDataGroup);
    }, [appConfig]);

    const exitConfig = useCallback(() => {
        window.location.href = window.location.href.replace('configureApp', '');
    }, []);

    if (loading) {
        return null;
    }

    return (
        <Box p={3} maxHeight='100%' maxWidth='100%'>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <NoticeBox title='Administrator only configuration page'>
                        This page aims to configure the MAHA EPI Catch-Up app
                        for all users
                    </NoticeBox>
                </Grid>
                <Grid item xs={12}>
                    <ImmunizationIndicatorGroupSelector
                        value={immunizationIndicatorGroup}
                        onChange={setImmunizationIndicatorGroup}
                    />
                </Grid>
                <Grid item xs={12}>
                    <ImmunizationDataGroupSelector
                        value={immunizationDataGroup}
                        onChange={setImmunizationDataGroup}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        primary
                        onClick={() =>
                            mutate({
                                immunizationIndicatorGroup:
                                    immunizationIndicatorGroup,
                                immunizationDataGroup: immunizationDataGroup,
                            })
                        }
                    >
                        Save
                    </Button>
                    &nbsp;
                    <Button onClick={exitConfig}>Leave</Button>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <RawConfig />
                </Grid>
            </Grid>
        </Box>
    );
};
