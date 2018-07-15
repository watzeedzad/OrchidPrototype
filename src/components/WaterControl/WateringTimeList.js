import React, { Component } from 'react';
import { Container, Row, Col, Alert  } from 'reactstrap';
import { connect } from 'react-redux'
import { Button } from 'reactstrap';
import ClockPiker from '../../Utils/ClockPicker';
import { Modal, ModalHeader} from 'reactstrap';
import { saveWaterConfig } from '../../redux/actions/waterActions'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import 'bootstrap/dist/css/bootstrap.min.css';

class WateringTimeList extends Component {
    
    state = {
        setTimeList: [],
        modal: false,
        visible: true,
        mss: ''
    }

    componentDidMount() {
        const wateringTimeList = this.props.wateringTimeList
        this.setState({
            mss:this.props.mss
        })
        if (wateringTimeList.data!=null){    
            if (wateringTimeList.data.timeRanges.length>0){
                const newArr = []
                for (let index = 0; index < wateringTimeList.data.timeRanges.length; index++) {
                    const mills = wateringTimeList.data.timeRanges[index];
                    const date = new Date(mills)
                    newArr.push(date)
                }
                this.setState({setTimeList:newArr})
            }
        }
    }
    
    render() {
        const { waterConfig} = this.props

        if (waterConfig.isRejected) {
            return <div className="alert alert-danger">Error: {waterConfig.data}</div>
        }

        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            {this.state.mss}
                            <Button color="primary" onClick={() => this.toggle()}>เพิ่มเวลา</Button>{' '}
                            <br/><hr/>
                            <Modal isOpen={this.state.modal} toggle={this.toggle} autoFocus={false} size='sm'>
                                <ModalHeader toggle={this.toggle}>ตั้งเวลารดน้ำ</ModalHeader>
                                <div align="center">
                                    <br/>
                                    <ClockPiker toggle={this.toggle} addTime={this.addTime}/>
                                </div>
                                &nbsp;
                            </Modal>
                        </Col>
                    </Row>
                    {/* <Row> */}
                    <Timeline>
                                <TimelineEvent createdAt="12.00 น.">
                                                <Button color="secondary" size="sm">แก้ไข</Button>{' '}
                                                <Button color="danger" size="sm">ลบ</Button>
                                            </TimelineEvent>
                                            <TimelineEvent createdAt="16.00 น.">
                                                <Button color="secondary" size="sm">แก้ไข</Button>{' '}
                                                <Button color="danger" size="sm">ลบ</Button>
                                            </TimelineEvent>
                                            <TimelineEvent createdAt="18.00 น.">
                                                <Button color="secondary" size="sm">แก้ไข</Button>{' '}
                                                <Button color="danger" size="sm">ลบ</Button>
                                            </TimelineEvent> 
                                </Timeline>
                        {/* {this.state.setTimeList.length > 0 && this.state.setTimeList.map(e => {
                            let hour = e.getHours()<10? '0'+e.getHours():e.getHours()
                            let minute = e.getMinutes()<10? '0'+e.getMinutes():e.getMinutes()
                            let time = hour+":"+minute+" น. หรือ "+this.tConvert(hour+":"+minute)
                            return (
                                        
                                <TimelineEvent createdAt="2016-09-12 10:06 PM">
                                    <Button color="secondary" size="sm">แก้ไข</Button>{' '}
                                    <Button color="danger" size="sm">ลบ</Button>
                                </TimelineEvent>
                                

                                 <Col xs='12' sm='12' md='12' lg='12' xl='12' >
                                     {hour}:{minute} น. หรือ {this.tConvert(hour+":"+minute)}
                                     <Field name="time" component={renderField} type="text" readOnly/> 
                                     <Button color="secondary" size="sm"
                                         onClick={() => buttonEdit(e._id)}>แก้ไข</Button>{' '}
                                     <Button color="danger" size="sm"
                                         onClick={() => buttonDelete(e._id)}>ลบ</Button>  
                                 </Col>
                            )
                        })}
                        </Timeline> */}
                    {/* </Row> */}
                </div>
            </Container>
        )
    }

    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(saveWaterConfig(values)).then(() => {
            this.props.onToggle()
        })
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    checkDuplicateTime = (val,curTimeList) => {
        for (let index = 0; index < curTimeList.length; index++) {
            const time = curTimeList[index];
            if(time.getTime()==val.getTime()){
                return false;
            }
        }
        return true;
    }

    addTime = (val) => {
        if(this.checkDuplicateTime(val,this.state.setTimeList)){
        var newArray = this.state.setTimeList.slice();    
        newArray.push(val);
        newArray.sort();
        this.onSubmit({greenHouseId:789456123,timeRanges:newArray})
        }else{
            this.setState({mss: 
                <div>
                    <Alert  color="warning" isOpen={this.state.visible} toggle={this.onDismiss}>
                        เวลาที่เลือกซ้ำกับที่เคยตั้งไว้
                    </Alert >
                </div>
            })
        }
    }

    onDismiss = () => {
        this.setState({ mss: '' });
    }

    tConvert = (time) => {
        var time_part_array = time.split(":");
        var ampm = ' AM';
    
        if (time_part_array[0] >= 12) {
            ampm = ' PM';
        }   
        if (time_part_array[0] > 12) {
            time_part_array[0] = time_part_array[0] - 12;
        }
        if (time_part_array[0] < 10 && ampm ==' PM') {
            time_part_array[0] = "0"+time_part_array[0] ;
        }
        var formatted_time = time_part_array[0] + ':' + time_part_array[1] + ampm;    
        return formatted_time;
    }

}

function mapStateToProps(state) {
    return {
        waterConfig: state.waterReducers.waterConfig,
    }
}

export default connect(mapStateToProps)(WateringTimeList)