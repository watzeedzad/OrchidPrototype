import React, { Component } from 'react';
import Speedometer from '../../Utils/Speedometer'

class MoistureGauge extends Component {
    
    render() {
        if (!this.props.currentValue){
            return <div className="alert alert-danger">ไม่มีข้อมูลจากเซนเซอร์</div>
        }

        return (
            <Speedometer
                title={"ความชื้นเครื่องปลูก ณ ปัจจุบัน"}
                min= {0}
                max= {100}
                minConfig={this.props.minConfig}
                maxConfig={this.props.maxConfig}
                currentValue={this.props.currentValue}
                minColor={"#C7F3FF"}
                midColor={"#51DBFF"}
                maxColor={"#00B9E9"} />
        )
    }
}

export default MoistureGauge