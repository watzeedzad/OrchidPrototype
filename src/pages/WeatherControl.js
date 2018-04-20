import React, { Component } from 'react'
import SettingTemperature from '../components/Temperature/SettingTemperature';
import Speedometer from '../Utils/Speedometer';

class WeatherControl extends Component {
    render() {       
        return (
            <div>
                <Speedometer />
                <SettingTemperature />
            </div>
        )
    }
}

export default WeatherControl