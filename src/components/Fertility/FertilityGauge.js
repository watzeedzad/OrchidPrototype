import React, { Component } from 'react';
import Speedometer from '../../Utils/Speedometer'

class FertilityGauge extends Component {

    render() {
        // if (!this.props.currentValue) {
        //     return <div className="alert alert-danger">ไม่มีข้อมูลจากเซนเซอร์</div>
        // }

        return (
            <Speedometer
                min={0}
                max={100}
                minConfig={this.props.minConfig}
                maxConfig={this.props.maxConfig}
                currentValue={this.props.currentValue}
                minColor={"#E8B79E"}
                midColor={"#D98559"}
                maxColor={"#BE5C2A"} />
        )
    }
}

export default FertilityGauge