import React, { Component } from 'react'
import Temperature from '../components/Temperature/Temperature';
import Humidity from '../components/Humidity/Humidity'

class WeatherControl extends Component {
    render() {       
        return (
            <div>
                <Temperature />
                <Humidity />
            </div>
        )
    }
}

export default WeatherControl