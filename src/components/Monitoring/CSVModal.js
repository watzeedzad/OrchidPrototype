import React, { Component } from 'react'
import { ModalBody } from 'reactstrap';
import { loadFarmCSV, loadGreenHouseCSV, loadProjectCSV } from '../../redux/actions/monitoringActions'
import { connect } from 'react-redux'
import {CSVLink} from 'react-csv';

class CSVModal extends Component {

    componentDidMount() {
        const {farmId,greenHouseId,projectId} = this.props
        this.props.dispatch(loadFarmCSV({farmId: farmId})).then(() => {
            this.props.dispatch(loadGreenHouseCSV({farmId: farmId,greenHouseId:greenHouseId})).then(() => {
                this.props.dispatch(loadProjectCSV({farmId: farmId, greenHouseId:greenHouseId, projectId:projectId}))
            })
        })
    }

    render() {
        const { farmCSV,greenHouseCSV,projectCSV } = this.props

        if (farmCSV.isRejected || greenHouseCSV.isRejected || projectCSV.isRejected) {
            return <div className="alert alert-danger">Error:{farmCSV.data}</div>
        }
        if (farmCSV.isLoading || greenHouseCSV.isLoading || projectCSV.isLoading) {
            return <div>Loading...</div>
        }
        if (farmCSV.data.errorMessage || greenHouseCSV.data.errorMessage || projectCSV.data.errorMessage) {
            return 
                <div>
                    <ModalBody>
                        {farmCSV.data.errorMessage}
                    </ModalBody>
                </div>
        }
        
        const headers = [
            {label: 'farmId', key: 'farmId'},
            {label: 'greenHouseId', key: 'greenHouseId'},
            {label: 'projectId', key: 'projectId'},
            {label: 'trunkDiameter', key: 'trunkDiameter'},
            {label: 'leafWidth', key: 'leafWidth'},
            {label: 'totalLeaf', key: 'totalLeaf'},
            {label: 'height', key: 'height'},
        ]

        return (
            <div>
                <ModalBody>
                    <CSVLink data={farmCSV.data} headers={headers}> export ข้อมูลของทั้งฟาร์ม </CSVLink><br /><br /><hr />
                    <CSVLink data={greenHouseCSV.data} headers={headers}> export ข้อมูลของทั้งโรงเรือน </CSVLink><br /><br /><hr />
                    <CSVLink data={projectCSV.data} headers={headers}> export ข้อมูลของทั้งโปรเจ็ค </CSVLink><br /><br /><hr />
                </ModalBody>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        farmCSV: state.monitoringReducers.farmCSV,
        greenHouseCSV: state.monitoringReducers.greenHouseCSV,
        projectCSV: state.monitoringReducers.projectCSV
    }
}

export default connect(mapStateToProps)(CSVModal)