import React, {useContext, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {IndicatorsContext} from "../context/IndicatorsContext";

export function DistrictSelector(props) {
    const [selectedDistrict, setDistrict] = useState();
    const {districtUnits} = useContext(IndicatorsContext);

    return <FormControl >
        <InputLabel >
            Selection of the geographical area
        </InputLabel>
        <Select
            value={selectedDistrict ? selectedDistrict.id : ''}
            onChange={(evt) => {
                const district = districtUnits.organisationUnits.find(i => i.id === evt.target.value)
                setDistrict(district);
                props.onChange(district);
            }}
        >
            <MenuItem value=""><em>None</em></MenuItem>
            {districtUnits.organisationUnits.map(district =>
                <MenuItem value={district.id} key={district.id} name={district.name}>{district.name}</MenuItem>
            )}
        </Select>
    </FormControl>;
}
