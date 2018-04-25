import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import Speedometer from '../../Utils/Speedometer'

class TemperatureGauge extends Component {

    render() {
        return (
            <Speedometer 
                minConfig={this.props.minConfig}
                maxConfig={this.props.maxConfig}
                currentValue={this.props.currentValue}
                minColor={"#6FCEE6"}
                midColor={"#8DE239"}
                maxColor={"#E84848"}/>
        )
    }
}

export default TemperatureGauge