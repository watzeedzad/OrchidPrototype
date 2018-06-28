import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import ClockPiker from '../../Utils/ClockPicker';
import { Modal, ModalHeader} from 'reactstrap';
import { Field, reduxForm ,Form} from 'redux-form';
import renderField from '../../Utils/renderField'
import { saveWaterConfig,getWateringTime } from '../../redux/actions/waterActions'
import { debounce } from 'lodash'
import 'bootstrap/dist/css/bootstrap.min.css';

class WateringTimeList extends Component {
    
    state = {
        setTimeList: [],
        refresh: true,
        modal: false
    }

    componentWillReceiveProps() {
        const wateringTimeList = this.props.wateringTimeList
        
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

    

    handleInitialize() {
        let initData = {
            "greenHouseId": 789456123,
            "timeRanges": this.state.setTimeList
        };
        this.props.initialize(initData);
    }
    
    render() {
        
        const { handleSubmit,wateringTimeList} = this.props

        
        this.handleInitialize()

        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <Button color="primary" onClick={() => this.toggle()}>เพิ่มเวลา</Button>{' '}
                            <form>
                                <Field name="greenHouseId" component={renderField} type="hidden" />
                                <Field name="timeRanges" component={renderField} type="hidden" />
                                <Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button>
                            </form>
                            <br/><hr/>
                            <div align="center">
                                <Modal isOpen={this.state.modal} toggle={this.toggle} autoFocus={false} size='sm'>
                                    <ModalHeader toggle={this.toggle}>ตั้งเวลารดน้ำ</ModalHeader>
                                    <div align="center">
                                        <br/>
                                        <ClockPiker toggle={this.toggle} addTime={this.addTime}/>
                                    </div>
                                    &nbsp;
                                </Modal>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {this.state.setTimeList.length > 0 && this.state.setTimeList.map(e => {
                            let hour = e.getHours()<10? '0'+e.getHours():e.getHours()
                            let minute = e.getMinutes()<10? '0'+e.getMinutes():e.getMinutes()
                            return (
                                <Col xs='12' sm='12' md='12' lg='12' xl='12' >
                                    {hour}:{minute} น. หรือ {this.tConvert(hour+":"+minute)}
                                    {/* <Field name="time" component={renderField} type="text" readOnly/> */}
                                    {/* <Button color="secondary" size="sm"
                                        onClick={() => buttonEdit(e._id)}>แก้ไข</Button>{' '}
                                    <Button color="danger" size="sm"
                                        onClick={() => buttonDelete(e._id)}>ลบ</Button> */}
                                </Col>
                            )
                        })}
                    </Row>
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

    addTime = (val) => {
        var newArray = this.state.setTimeList.slice();    
        newArray.push(val);
        newArray.sort();   
        this.setState({setTimeList:newArray})
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

const form = reduxForm({
    form: 'waterConfig'
})


export default (form(WateringTimeList))