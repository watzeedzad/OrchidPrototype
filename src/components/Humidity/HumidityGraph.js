import React, { Component } from 'react';
import { getHumidityHistory } from '../../redux/actions/weatherActions'
import { connect } from 'react-redux'
import LineGraph from '../../Utils/LineGraph'
import 'bootstrap/dist/css/bootstrap.min.css';

class HumidityGraph extends Component {

    componentDidMount() {
        this.props.dispatch(getHumidityHistory({ greenHouseId: 789456123 }))
    }

    render() {
        const { humidityHistory } = this.props
        const { data } = humidityHistory

        if (humidityHistory.isRejected) {
            return <div className="alert alert-danger">Error: {humidityHistory.data}</div>
        }
        if (humidityHistory.isLoading) {
            return <div>Loading...</div>
        }
        if (data.message){
            return <div className="alert alert-danger">{data.message}</div>
        }
        const history = []
        for (let index = 0; index < data.humidityHistory.length; index++) {
            history[index] = data.humidityHistory[index].currentHumidity;
        }
      
        return (
            <div>
                <LineGraph history={history} name='ประวัติความชื้นในอากาศของวันนี้' yName='ความชื้นในอากาศ'/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        humidityHistory: state.weatherReducers.humidityHistory,
    }
}

export default connect(mapStateToProps)(HumidityGraph)