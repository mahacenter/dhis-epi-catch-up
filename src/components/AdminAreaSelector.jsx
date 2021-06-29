import React, { Component } from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { getDataObject } from './../js/api'

export class AdminAreaSelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedArea: this.props.selectedArea
        }
    }

    renderOptions() {
        // var test = await getOrgUnitList({ ouLevel:this.props.ouLevel })
        var dataObj = getDataObject()
        var items = dataObj.orgUnitList[this.props.ouLevel].features.map(e => {
            var obj = {id: e.id, name: e.properties.name}
            return obj
        })
        return items.map((dt, i) => {
            return (
                <MenuItem value={dt.id} key={i + 1} name={dt.name}>{dt.name}</MenuItem>
            )
        })
    }

    render() {
        return (
                <FormControl className={"no-top-margin"}>
                    <InputLabel >
                        Admin Area
                    </InputLabel>
                    <Select
                        value={this.props.selectedArea}
                        onChange={(evt) => {
                            this.props.onChange(evt.target.value, evt.nativeEvent.target.innerText)
                        }}
                    >
                    <MenuItem value={''} key={0} name={'None selected'}>{'None selected'}</MenuItem>
                    {this.renderOptions()}
                    </Select>
                </FormControl>
        )
    }
}
