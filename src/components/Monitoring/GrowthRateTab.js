import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    addGrowthRate, resetStatus
} from '../../redux/actions/monitoringActions'
import { UncontrolledAlert, Modal, ModalHeader, Button } from 'reactstrap';
import GrowthRateForm from './GrowthRateForm'
import {CSVLink} from 'react-csv';

class GrowthRateTab extends Component {
    //มีการใช้ Modal ของ reactstrap ซึ่งจะต้องเก็บ State การแสดง modal ไว้
    state = {
        modal: false,
        modalTitle: '',
        data: [],
        mss: ''
    }

    //สั่ง dispach ฟังก์ชัน loadUsers
    componentDidMount() {
        //this.props.dispatch(loadUsers({farmId: 123456789}))
    }

    render() {
        const { growthRate, csvGrowthRate, growthRateSave } = this.props
        // if (users.isRejected) {
        //     //ถ้ามี error
        //     return <div className="alert alert-danger">Error:{users.data}</div>
        // }
        
        const headers = [
            {label: 'รหัสฟาร์ม', key: 'farmId'},
            {label: 'รหัสโรงเรือน', key: 'greenHouseId'},
            {label: 'รหัสโปรเจ็ค', key: 'projectId'},
            {label: 'เส้นผ่านศูนย์กลางลำต้น', key: 'trunkDiameter'},
            {label: 'ความกว้างใบ', key: 'leafWidth'},
            {label: 'จำนวนใบ', key: 'totalLeaf'},
            {label: 'ความสูง', key: 'height'},
        ]         

        return (
            <div>
                {this.state.mss}
                {/* <CSVLink data={csvGrowthRate} headers={headers}> ดาวน์โหลดไฟล์ csv </CSVLink> */}
                <Button color="success" size="sm" onClick={this.handleNew}>เพิ่มข้อมูล</Button>
    
                {/* เป็น Component สำหรับแสดง Modal ของ reactstrap 
                ซึ่งเราต้องควบคุมการแสดงไว้ที่ไฟล์นี้ ถ้าทำแยกไฟล์จะควบคุมยากมากครับ */}
                <Modal isOpen={this.state.modal} toggle={this.toggle}
                    className="modal-primary" autoFocus={false}>
                    <ModalHeader toggle={this.toggle}>{this.state.modalTitle}การเจริญเติบโต</ModalHeader>
                    {/* เรียกใช้งาน Component UserForm และส่ง props ไปด้วย 4 ตัว */}
                    <GrowthRateForm
                        data={this.state.data}
                        growthRateSave={growthRateSave}
                        onSubmit={this.handleSubmit}
                        onToggle={this.toggle} />
                </Modal>
            </div>
        )
    }

    //ฟังก์ชันสั่งแสดง/ปิด modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    //ฟังก์ชันสร้างข้อมูลใหม่โดยจะสั่งให้เปิด Modal
    handleNew = () => {
        this.props.dispatch(resetStatus())

        this.setState({ modalTitle: 'เพิ่ม' ,data:{greenHouseId: 789456123,projectId: 1}})
        this.toggle();
    }

    //ฟังก์ชันบันทึกข้อมูล
    handleSubmit = (values) => {
            this.props.dispatch(addGrowthRate(values)).then(() => {
                if (!this.props.growthRateSave.isRejected) {
                    this.toggle()
                    this.setState({
                        mss: 
                            <div>
                                <UncontrolledAlert  color="success">
                                    ทำการเพิ่มข้อมูลสำเร็จ
                                </UncontrolledAlert >
                            </div>
                      })
                    //this.props.dispatch(loadGrowthRate({farmId: 123456789}))
                }
            })
    }

}

function mapStateToProps(state) {
    return {
        csvGrowthRate: state.monitoringReducers.csvGrowthRate,
        growthRate: state.monitoringReducers.growthRate,
        growthRateSave: state.monitoringReducers.growthRateSave
    }
}

export default connect(mapStateToProps)(GrowthRateTab)