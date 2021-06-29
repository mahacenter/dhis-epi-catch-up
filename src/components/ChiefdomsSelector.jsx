import React, {useContext, useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {IndicatorsContext} from "../context/IndicatorsContext";
import Input from "@material-ui/core/Input";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

export function ChiefdomsSelector(props) {
    const {onChange} = props;
    const {chiefdomUnits} = useContext(IndicatorsContext);

    const chiefdomsOfSelectedDistrict = (props.district && chiefdomUnits.organisationUnits.filter(unit => unit.parent.id === props.district.id)) || [];
    const [selectedChiefdoms, setChiefdoms] = useState(chiefdomsOfSelectedDistrict);
    const selectedChiefdomNames = selectedChiefdoms.map(c => c.name);

    useEffect(() => {
        setChiefdoms(chiefdomsOfSelectedDistrict);
        onChange(chiefdomsOfSelectedDistrict);
    }, [onChange, props.district]);

    return <FormControl >
        <InputLabel >
            Deselect specific areas at will
        </InputLabel>
        <Select
            multiple
            input={<Input />}
            renderValue={(selected) => selected.join(', ')}
            value={selectedChiefdomNames}
            onChange={(evt) => {
                const chiefdoms = chiefdomsOfSelectedDistrict.filter(unit => evt.target.value.includes(unit.name));
                setChiefdoms(chiefdoms);
                props.onChange(chiefdoms);
            }}
        >
            {chiefdomsOfSelectedDistrict.map(chiefdom =>
                <MenuItem value={chiefdom.name} key={chiefdom.name}>
                    <Checkbox checked={selectedChiefdomNames.indexOf(chiefdom.name) > -1} />
                    <ListItemText primary={chiefdom.name} />
                </MenuItem>
            )}
        </Select>
    </FormControl>;
}
