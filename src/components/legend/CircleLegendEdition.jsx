import {useDataQuery} from '@dhis2/app-runtime'
import React, {useEffect, useState} from "react";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import ColorPicker from "../color/ColorPicker";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {CircularLoader} from "@dhis2/ui-core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import _ from "lodash";
import {DATA_GROUPS} from "../../js/customDhisVariables";

const query = {
    dataElements: {
        resource: 'dataElements',
        params: {
            fields: 'id,displayName~rename(name)',
            filter: `dataElementGroups.id:eq:${DATA_GROUPS.IMMUNIZATION}`,
            paging: 'false',
        },
    },
};

function CircleLegendEdition(props) {
    const [isEnabled, setEnabled] = useState(props.legend.isEnabled);
    const [dataElement, setDataElement] = useState(props.legend.dataElement);
    const [size, setSize] = useState(props.legend.size);
    const [opacity, setOpacity] = useState(props.legend.opacity);
    const [color, setColor] = useState(props.legend.color);
    const [stroke, setStroke] = useState(props.legend.stroke);
    const [strokeWidth, setStrokeWidth] = useState(props.legend.strokeWidth);
    const { loading, error, data} = useDataQuery(query)

    const notifyChange = () => {
        props.onChange({isEnabled, size, opacity, color, stroke, strokeWidth, dataElement});
    }
    useEffect(notifyChange, [isEnabled, size, opacity, color, stroke, strokeWidth, dataElement]);

    if (loading || !data) {
        return <CircularLoader small/>;
    }
    if (error) return <span>{error.message}</span>
    if (_.isEmpty(data.dataElements.dataElements)) return <span>{error.message}</span>
    if (!dataElement) {
        setDataElement(data.dataElements.dataElements[0]);
        return;
    }

    return <Box>
        <Box display="flex" alignItems="center">
            <Box mr={3}>Enable</Box>
            <Checkbox onChange={() => setEnabled(!isEnabled)}
                      checked={isEnabled}
                      color="primary"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}/>
        </Box>
        { isEnabled && <>
            <Divider/>
            <FormControl>
                <Box display="flex" alignItems="center" mt={2}>
                    <Box mr={3} className="xs-hidden">Opacity</Box>
                    <Box mr={3}><VisibilityOffIcon opacity={0.6} /></Box>
                    <Slider
                        value={opacity}
                        min={0} max={1} step={0.1}
                        onChange={(event, value) => setOpacity(value)}
                        valueLabelDisplay="auto"
                    />
                    <Box ml={3}><VisibilityIcon opacity={0.6}/></Box>
                </Box>
            </FormControl>
            <FormControl>
                <InputLabel >
                    Indicator
                </InputLabel>
                <Select value={dataElement.id}
                        onChange={(event, item) => setDataElement({id: item.props.value, name: item.props.name})}
                >
                    {data.dataElements.dataElements.map((element, i) =>
                        <MenuItem
                            value={element.id}
                            key={i}
                            name={element.name}
                        >
                            {element.name}
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
            <FormControl>
                <Box>
                    <Typography gutterBottom>Size</Typography>
                    <Slider
                        value={size}
                        min={1} max={1000}
                        onChange={(event, value) => setSize(value)}
                        valueLabelDisplay="auto"
                    />
                </Box>
            </FormControl>
            <Box display="flex">
                <FormControl>
                    <Box>
                        <Typography gutterBottom>Color</Typography>
                        <ColorPicker onChange={value => setColor(value)} initialValue={color}/>
                    </Box>
                </FormControl>
                <FormControl>
                    <Box>
                        <Typography gutterBottom>Stroke</Typography>
                        <ColorPicker onChange={value => setStroke(value)} initialValue={stroke}/>
                    </Box>
                </FormControl>
                <FormControl>
                    <Box>
                        <Typography gutterBottom>Stroke width</Typography>
                        <Slider
                            value={strokeWidth}
                            min={0} max={5}
                            onChange={(event, value) => setStrokeWidth(value)}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </FormControl>
            </Box>
        </>}
    </Box>;
}

export {CircleLegendEdition};
