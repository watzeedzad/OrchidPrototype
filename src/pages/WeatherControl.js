import React, { Component } from 'react'
import SettingTemperature from '../components/Temperature/SettingTemperature';
import TemperatureGauge from '../components/Temperature/TemperatureGauge';

class WeatherControl extends Component {
    render() {       
        return (
            <div>
                <TemperatureGauge />
                <SettingTemperature />
            </div>
        )
    }
}

export default WeatherControl