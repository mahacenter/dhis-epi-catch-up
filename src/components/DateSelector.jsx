import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React, {useState} from 'react';

const thisYear = new Date().getFullYear()
export const years = [0, 1, 2, 3, 4].map(year => thisYear - year)

export function DateSelector({ onChange }) {
    const [selectedDate, setSelectedDate] = useState(years[0]);

    return (
        <FormControl>
            <InputLabel>Selection of the date range</InputLabel>
            <Select
                value={selectedDate}
                onChange={evt => {
                    setSelectedDate(evt.target.value);
                    onChange(evt.target.value);
                }}
            >
                {years.map(year => (
                    <MenuItem
                        value={year}
                        key={year}
                        name={year}
                    >
                        {year - 1}/{year}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
