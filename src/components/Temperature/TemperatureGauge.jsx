import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { getTemp } from '../../redux/actions/weatherActions'
import { connect } from 'react-redux'
import Speedometer from '../../Utils/Speedometer'

class TemperatureGauge extends Component {

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
            <Speedometer 
                minTempConfig={data.minConfigTemperature}
                maxTempConfig={data.maxConfigTemperature}
                currentTemp={data.currentTemperature}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        temp: state.weatherReducers.temp,
    }
}

export default connect(mapStateToProps)(TemperatureGauge)