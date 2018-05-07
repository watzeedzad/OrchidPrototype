import React, { Component } from 'react'
import Moisture from '../components/Moisture/Moisture'
import ShowAllFertility from '../components/Fertility/ShowAllFertility'

class PlanterAnalyze extends Component {
    render() {       
        return (
            <div>
                <Moisture/><br/><hr/>
                <ShowAllFertility/>
            </div>
        )
    }
}

export default PlanterAnalyze