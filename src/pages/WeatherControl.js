import React, { Component } from 'react'
import GaugeSeries from "../Utils/GaugeSeries";

class WeatherControl extends Component {
    render() {       
        return (
            <div>
                <GaugeSeries/>
            </div>
        )
    }
}

export default WeatherControl