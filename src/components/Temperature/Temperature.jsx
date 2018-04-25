import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { getTemp } from '../../redux/actions/weatherActions'
import { connect } from 'react-redux'
import TemperatureGauge from '../Temperature/TemperatureGauge'
import SettingTemperature from '../Temperature/SettingTemperature'

class Temperature extends Component {

    componentDidMount() {
        this.props.dispatch(getTemp({farmId: 123456789,greenHouseId: 25197568}))
    }

    render() {
        const { temp } = this.props
        const { data } = temp

        if (temp.isRejected) {
            return <div className="alert alert-danger">Error: {temp.data}</div>
        }
        if (temp.isLoading) {
            return <div>Loading...</div>
        }
        return (
            <div>
            <TemperatureGauge 
                minConfig={data.minConfigTemperature}
                maxConfig={data.maxConfigTemperature}
                currentValue={data.currentTemperature}
            />
            <SettingTemperature 
                minConfig={data.minConfigTemperature}
                maxConfig={data.maxConfigTemperature}
            />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        temp: state.weatherReducers.temp,
    }
}

export default connect(mapStateToProps)(Temperature)