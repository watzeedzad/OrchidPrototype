import React, { Component } from 'react'
import Temperature from '../components/Temperature/Temperature';

class WeatherControl extends Component {
    render() {       
        return (
            <div>
                <Temperature />
            </div>
        )
    }
}

export default WeatherControl