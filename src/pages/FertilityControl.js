import React, { Component } from 'react'
import Sidebar from '../components/Sidebar/Drawers'
import Fertility from '../components/Fertility/Fertility'

class FertilityControl extends Component {
    render() {       
        return (
            <div>
                <Sidebar/>
                <Fertility />
            </div>
        )
    }
}

export default FertilityControl