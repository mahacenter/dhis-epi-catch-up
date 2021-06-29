import _ from 'lodash'
import React, { Component } from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

export class IndicatorSelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            indicator: this.props.indicator
        }
    }

    renderOptions(groups, test) {
        var groupRef = groups.filter((o) => { return o.id === this.props.group })[0]
        var items = _.sortBy(groupRef.indicators, ['name']);
        if (test) {
            return items[0].id
        } else {
            return items.map((dt, i) => {
                return (
                    <MenuItem value={dt.id} key={i} name={dt.name}>{dt.name}</MenuItem>
                )
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.group !== this.props.group) {
            this.props.onChange(this.renderOptions(this.props.groups, true))
        }
    }

    render() {
        return (
            <div>
                <FormControl >
                    <InputLabel >
                        Indicator
                    </InputLabel>
                    <Select
                        disabled={this.props.disabled}
                        value={this.props.indicator}
                        onChange={(evt) => {
                            this.props.onChange(evt.target.value)
                        }}
                    >
                    {this.renderOptions(this.props.groups)}
                    </Select>
                </FormControl>
            </div>
        )
    }
}
