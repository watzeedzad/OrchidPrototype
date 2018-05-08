import React, { Component } from 'react'
import Moisture from '../components/Moisture/Moisture'
import ShowAllFertility from '../components/Fertility/ShowAllFertility'
import Sidebar from '../components/Sidebar/Drawers'

class PlanterAnalyze extends Component {
    render() {       
        return (
            <div>
                <Sidebar/>
                <Moisture/><br/><hr/>
                <ShowAllFertility/>
            </div>
        )
    }
}

export default PlanterAnalyze