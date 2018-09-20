import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadGrowthRate, addGrowthRate, resetStatus } from '../../redux/actions/monitoringActions'
import { UncontrolledAlert, Modal, ModalHeader, Button } from 'reactstrap';
import GrowthRateForm from './GrowthRateForm'
import CSVModal from './CSVModal'
import GrowthRateGraphTab from './GrowthRateGraphTab';

class GrowthRateTab extends Component {
    //มีการใช้ Modal ของ reactstrap ซึ่งจะต้องเก็บ State การแสดง modal ไว้
    state = {
        modal: false,
        csvModal: false,
        modalTitle: '',
        data: [],
        mss: ''
    }

    //สั่ง dispach ฟังก์ชัน loadUsers
    componentDidMount() {
        this.props.dispatch(loadGrowthRate({ greenHouseId: 789456123, projectId: 1 }))
    }

    render() {
        const { growthRate,growthRateSave } = this.props

        return (
            <div>
                {this.state.mss}
                <Button color="success" size="sm" onClick={this.csvToggle}>ดาวน์โหลดไฟล์ CSV</Button>{' '}
                <Button color="success" size="sm" onClick={this.handleNew}>เพิ่มข้อมูล</Button><br/><hr/>

                <GrowthRateGraphTab growthRate={growthRate}/>

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

                <Modal isOpen={this.state.csvModal} toggle={this.csvToggle}
                    className="modal-primary" autoFocus={false}>
                    <ModalHeader toggle={this.csvToggle}>ดาวน์โหลดไฟล์ csv</ModalHeader>
                    {/* เรียกใช้งาน Component UserForm และส่ง props ไปด้วย 4 ตัว */}
                    <CSVModal
                        farmId={123456789}
                        greenHouseId={789456123}
                        projectId={1} />
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

    csvToggle = () => {
        this.setState({
            csvModal: !this.state.csvModal
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
                    this.props.dispatch(loadGrowthRate({greenHouseId: 789456123, projectId: 1 }))
                }
            })
    }

}

function mapStateToProps(state) {
    return {
        growthRate: state.monitoringReducers.growthRate,
        growthRateSave: state.monitoringReducers.growthRateSave
    }
}

export default connect(mapStateToProps)(GrowthRateTab)