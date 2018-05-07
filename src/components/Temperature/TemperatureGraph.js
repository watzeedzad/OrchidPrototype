import React, { Component } from 'react';
import { getTempHistory } from '../../redux/actions/weatherActions'
import { connect } from 'react-redux'
import LineGraph from '../../Utils/LineGraph'
import 'bootstrap/dist/css/bootstrap.min.css';

class TemperatureGraph extends Component {

    componentDidMount() {
        this.props.dispatch(getTempHistory({ greenHouseId: 789456123 }))
    }

    render() {
        const { tempHistory } = this.props
        const { data } = tempHistory

        if (tempHistory.isRejected) {
            return <div className="alert alert-danger">Error: {tempHistory.data}</div>
        }
        if (tempHistory.isLoading) {
            return <div>Loading...</div>
        }

        const history = []
        for (let index = 0; index < data.temperatureHistory.length; index++) {
            history[index] = data.temperatureHistory[index].currentTemperature;
        }
      
        return (
            <div>
                <LineGraph history={history} name='ประวัติอุณหภูมิในวันนี้' />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        tempHistory: state.weatherReducers.tempHistory,
    }
}

export default connect(mapStateToProps)(TemperatureGraph)