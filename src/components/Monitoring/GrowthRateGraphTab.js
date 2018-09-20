import React, { Component } from 'react';
import GrowthRateGraph from '../../Utils/GrowthRateGraph'
import 'bootstrap/dist/css/bootstrap.min.css';

class GrowthRateGraphTab extends Component {

    render() {
        const { growthRate } = this.props
        const { data } = growthRate

        if (growthRate.isRejected) {
            return <div className="alert alert-danger">Error: {growthRate.data}</div>
        }
        if (growthRate.isLoading) {
            return <div>Loading...</div>
        }
        if (data.errorMessage){
            return <div className="alert alert-danger">{data.errorMessage}</div>
        }
        const timeStamp = []
        for (let index = 0; index < data.length; index++) {
            timeStamp[index] = data[index].timeStamp.slice(0,10).replace(/-/g,'/');
        }

        const trunkDiameter = []
        for (let index = 0; index < data.length; index++) {
            trunkDiameter[index] = data[index].trunkDiameter;
        }

        const leafWidth = []
        for (let index = 0; index < data.length; index++) {
            leafWidth[index] = data[index].leafWidth;
        }

        const totalLeaf = []
        for (let index = 0; index < data.length; index++) {
            totalLeaf[index] = data[index].totalLeaf;
        }

        const height = []
        for (let index = 0; index < data.length; index++) {
            height[index] = data[index].height;
        }
      
        return (
            <div>
                <GrowthRateGraph timeStamp={timeStamp} data={trunkDiameter} name='อัตราการเจริญเติบโตทางเส้นผ่านศูนย์กลางลำต้น' yName='เส้นผ่านศูนย์กลางลำต้น'/><br/><hr/>
                <GrowthRateGraph timeStamp={timeStamp} data={leafWidth} name='อัตราการเจริญเติบโตทางความกว้างของใบ' yName='ความกว้างของใบ'/><br/><hr/>
                <GrowthRateGraph timeStamp={timeStamp} data={totalLeaf} name='อัตราการเจริญเติบโตทางจำนวนของใบ' yName='จำนวนใบ'/><br/><hr/>
                <GrowthRateGraph timeStamp={timeStamp} data={height} name='อัตราการเจริญเติบโตทางความสูงของลำต้น' yName='ความสูงลำต้น'/><br/><hr/>
            </div>
        )
    }
}

export default GrowthRateGraphTab