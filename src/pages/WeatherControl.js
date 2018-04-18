import React, { Component } from 'react'
import GaugeSeries from "../Utils/GaugeSeries";
import SettingTemperature from '../components/Temperature/SettingTemperature';

class WeatherControl extends Component {
    render() {       
        return (
            <div>
                <GaugeSeries/>
                <SettingTemperature />
            </div>
        )
    }
}

export default WeatherControl