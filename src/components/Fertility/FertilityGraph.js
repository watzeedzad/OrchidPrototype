import React, { Component } from 'react';
import { getFertilityHistory } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import LineGraph from '../../Utils/LineGraph'
import 'bootstrap/dist/css/bootstrap.min.css';

class FertilityGraph extends Component {

    componentDidMount() {
        this.props.dispatch(getFertilityHistory({projectId: this.props.projectId}))
    }

    render() {
        const { fertilityHistory } = this.props
        const { data } = fertilityHistory

        if (fertilityHistory.isRejected) {
            return <div className="alert alert-danger">Error: {fertilityHistory.data}</div>
        }
        if (fertilityHistory.isLoading) {
            return <div>Loading...</div>
        }
        if (data.message){
            return <div className="alert alert-danger">{data.message}</div>
        }
        const history = []
        for (let index = 0; index < data.fertilityHistory.length; index++) {
            history[index] = data.fertilityHistory[index].currentFertility;
        }
      
        return (
            <div>
                <LineGraph history={history} name='ประวัติความอุดมสมบูรณ์ในเครื่องปลูกของวันนี้' yName='ปริมาณแร่ธาตุ'/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        fertilityHistory: state.planterReducers.fertilityHistory,
    }
}

export default connect(mapStateToProps)(FertilityGraph)