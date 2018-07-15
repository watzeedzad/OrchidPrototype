import React, { Component } from 'react';
import { getMoistureHistory } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import LineGraph from '../../Utils/LineGraph'
import 'bootstrap/dist/css/bootstrap.min.css';

class MoistureGraph extends Component {

    componentDidMount() {
        this.props.dispatch(getMoistureHistory({ greenHouseId: 789456123 }))
    }

    render() {
        const { moistureHistory } = this.props
        const { data } = moistureHistory

        if (moistureHistory.isRejected) {
            return <div className="alert alert-danger">Error: {moistureHistory.data}</div>
        }
        if (moistureHistory.isLoading) {
            return <div>Loading...</div>
        }
        if (data.errorMessage){
            return <div className="alert alert-danger">{data.errorMessage}</div>
        }
        const history = []
        for (let index = 0; index < data.soilMoistureHistory.length; index++) {
            history[index] = data.soilMoistureHistory[index].currentSoilMoisture;
        }
      
        return (
            <div>
                <LineGraph history={history} name='ประวัติความชื้นในเครื่องปลูกของวันนี้' yName='ความชื้นในเครื่องปลูก'/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        moistureHistory: state.planterReducers.moistureHistory,
    }
}

export default connect(mapStateToProps)(MoistureGraph)