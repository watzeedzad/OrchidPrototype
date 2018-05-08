import React, { Component } from 'react'
import Temperature from '../components/Temperature/Temperature';
import Humidity from '../components/Humidity/Humidity'
import Sidebar from '../components/Sidebar/Drawers'

class WeatherControl extends Component {
    render() {       
        return (
            <div>
                <Sidebar/>
                <Temperature /><br/><hr/>
                <Humidity />
            </div>
        )
    }
}

export default WeatherControl