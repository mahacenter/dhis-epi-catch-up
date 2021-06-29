import _ from 'lodash'
import React, { Component } from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {CUSTOM_LEGENDS} from "../js/customLegends";

export class LegendSelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            legend: this.props.legend
        }
    }

    renderOptions(legendSets, returnsIdOnly) {
        const groupRef = this.props.groups.find(group => group.id === this.props.group);
        const indicatorRef = groupRef.indicators.find(indicator => indicator.id === this.props.indicator)

        const items = this.props.allowAutoLegend ? [
            { id: 'auto', name: 'Personal setting' },
            ...CUSTOM_LEGENDS,
        ] : [];
        if (indicatorRef && indicatorRef.legendSet) {
            legendSets
                .filter(set => set.id === indicatorRef.legendSet.id)
                .forEach(set => items.push({ id: set.id, name: set.name }))
        }

        if (returnsIdOnly && _.isEmpty(items)) {
            return;
        }
        if (returnsIdOnly) {
            return items.length > 1 ? items[1].id : items[0].id;
        }
        return items.map((dt, i) => {
            return (
                <MenuItem value={dt.id} key={i} name={dt.name}>{dt.name}</MenuItem>
            )
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.indicator !== this.props.indicator) {
            this.props.onChange(this.renderOptions(this.props.legendSets, true))
        }
    }

    render() {
        return (
            <div>
                <FormControl >
                    <InputLabel >
                        Legend
                    </InputLabel>
                    <Select
                        disabled={this.props.disabled}
                        value={this.props.legend}
                        onChange={(evt) => {
                            this.props.onChange(evt.target.value)
                        }}
                    >
                    {this.renderOptions(this.props.legendSets)}
                    </Select>
                </FormControl>
            </div>
        )
    }
}
