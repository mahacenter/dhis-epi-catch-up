import React, { useCallback } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { saveAsPng } from '../util/saveAsPng';
import { InsertDriveFileOutlined } from '@material-ui/icons';

export const ExportButton = ({ id, title, filename }) => {
    const save = useCallback(() => saveAsPng(id, filename), [id, filename]);

    return (
        <Box className='boxed' data-html2canvas-ignore>
            <IconButton
                aria-label='export'
                size='small'
                title={title}
                onClick={save}
            >
                <Box ml={1} mr={1}>
                    Export
                </Box>{' '}
                <InsertDriveFileOutlined />
            </IconButton>
        </Box>
    );
};
