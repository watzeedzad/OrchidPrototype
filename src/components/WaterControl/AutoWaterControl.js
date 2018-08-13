import React, { Component } from 'react';
import { connect } from 'react-redux'
import { UncontrolledAlert } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import WateringTimeList from '../WaterControl/WateringTimeList'
import { getWateringTime } from '../../redux/actions/waterActions'

class AutoWaterControl extends Component {
    state = {
        mss: '',
        visible: true
    }

    componentDidMount() {
        //ดึงข้อมูลเวลาที่ตั้งไว้ทั้งหมดมาลง state
        this.props.dispatch(getWateringTime({ greenHouseId: 789456123 }))
    }

    render() {
        const { wateringTimeList} = this.props

        if (wateringTimeList.isRejected) {
            return <div className="alert alert-danger">Error: {wateringTimeList.data}</div>
        }
        if (wateringTimeList.isLoading) {
            return <div>Loading...</div>
        }
        if (wateringTimeList.data.errorMessage) {
            return <div className="alert alert-danger">Error: {wateringTimeList.data.errorMessage}</div>
        }

        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <WateringTimeList wateringTimeList={wateringTimeList} 
                            onToggle={this.toggle} 
                            onDelete={this.delete} 
                            mss={this.state.mss}/>
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }

    toggle = () => {
        this.setState({
            mss: 
                <div>
                    <UncontrolledAlert  color="success">
                        บันทึกการตั้งค่าเวลาการให้น้ำสำเร็จ
                    </UncontrolledAlert >
                </div>
        })
        this.props.dispatch(getWateringTime({ greenHouseId: 789456123 }))
    }

    delete = () => {
        this.setState({
            mss: 
                <div>
                    <UncontrolledAlert  color="success">
                        ทำการลบเวลาการให้น้ำสำเร็จ
                    </UncontrolledAlert >
                </div>
        })
        this.props.dispatch(getWateringTime({ greenHouseId: 789456123 }))
    }

}

function mapStateToProps(state) {
    return {
        wateringTimeList: state.waterReducers.wateringTimeList,
    }
}

export default connect(mapStateToProps)(AutoWaterControl);