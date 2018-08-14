import React, { Component } from 'react';
import ReactProgressMeter  from 'react-progress-meter'

class LightIntensityGauge extends Component {
    
    render() {
        if (!this.props.currentValue){
            return <div className="alert alert-danger">ไม่มีข้อมูลจากเซนเซอร์</div>
        }

        return (
            <ReactProgressMeter 
                currentProgress={this.props.currentProgress} 
                showPercent={true}
                show={true}
                color="yellow" />
        )
    }
}

export default LightIntensityGauge