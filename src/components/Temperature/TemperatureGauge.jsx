import React, { Component } from 'react';
import Speedometer from '../../Utils/Speedometer'

class TemperatureGauge extends Component {
    
    render() {
        if (!this.props.currentValue){
            return <div className="alert alert-danger">ไม่มีข้อมูลจากเซนเซอร์</div>
        }

        return (
            <Speedometer
                minConfig={this.props.minConfig}
                maxConfig={this.props.maxConfig}
                currentValue={this.props.currentValue}
                minColor={"#6FCEE6"}
                midColor={"#8DE239"}
                maxColor={"#E84848"} />
        )
    }
}

export default TemperatureGauge