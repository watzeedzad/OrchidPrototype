import React,{Component} from 'react';
import {Container,Row,Col,Alert} from 'reactstrap';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import ClockPiker from '../../Utils/ClockPicker';
import { Modal, ModalHeader} from 'reactstrap';
import { saveFertilizerConfig } from '../../redux/actions/fertilizerActions';
import 'bootstrap/dist/css/bootstrap.min.css';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

class FertilizerTimeList extends Component{

    constructor(props){
        super(props);
        this.state={
            setTimeList: [],
            modal: false,
            visible: true,
            mss: ''
        }
    }

    componentDidMount(){
        const fertilizerTimeList = this.props.fertilizerTimeList;
        this.setState({
            mss:this.props.mss
        });
        if(fertilizerTimeList.data!=null){
            if (fertilizerTimeList.data.timeRanges.length>0){
                const newArr = [];
                for(let i = 0 ;i< fertilizerTimeList.data.timeRanges.length;i++){
                    const mills = fertilizerTimeList.data.timeRanges[i];
                    const date = new Date(mills);
                    newArr.push(date);
                }
                this.setState({setTimeList:newArr});
            }
        }
    }

    render(){
        const { fertilizerConfig} = this.props

        if (fertilizerConfig.isRejected) {
            return <div className="alert alert-danger">Error: {fertilizerConfig.data}</div>
        }
        return(
        <Container>
            <div id='time-modal-content'>
             <Row>
              <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                {this.state.mss}
                <Button color='primary' onClick={()=> this.toggle()}>เพิ่มเวลา</Button>
                <br/><hr/>
                <Modal isOpen={this.state.modal} toggle={this.toggle} autoFocus={false} size='xs'>
                    <ModalHeader toggle={this.toggle}>ตั้งเวลาให้ปุ๋ย</ModalHeader>
                    <div align='center'>
                        <br/>
                        <ClockPiker toggle={this.toggle} addTime={this.addTime}></ClockPiker>
                    </div>
                    &nbsp;
                </Modal>
              </Col>
            </Row>
            </div>
            <div id='time-list'>
                <Row>
                    <VerticalTimeline>
                    {this.state.setTimeList.length > 0 && this.state.setTimeList.map(e=>{
                        let hour = e.getHours()<10? '0'+e.getHours():e.getHours()
                        let minute = e.getMinutes()<10? '0'+e.getMinutes():e.getMinutes()
                        let time = hour+":"+minute+" น. หรือ "+this.tConvert(hour+":"+minute)
                        return(
                            <VerticalTimelineElement
                                className="vertical-timeline-element--work"
                                iconStyle={{ background: 'rgb(150, 84, 0)', color: '#fff' }}
                                >
                                <h3 className="vertical-timeline-element-title">{time}</h3>
                                <p>
                                <Button color="secondary" size="sm">แก้ไข</Button>{' '}
                                     <Button color="danger" size="sm">ลบ</Button> 
                                </p>
                            </VerticalTimelineElement>
                        )
                    })}
                    </VerticalTimeline>
                </Row>
            </div>
        </Container>
        )
    }

    onSubmit = (values) =>{
        this.props.dispatch(saveFertilizerConfig(values)).then(()=>{
            this.props.onToggle()
        });
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    checkDuplicateTime = (val,curTimeList) =>{
        for(let index = 0 ; index < curTimeList.length; index++){
            const time = curTimeList[index];
            if(time.getTime()==val.getTime()){
                return false;
            }
        }
        return true;
    }

    addTime = (val) =>{
        if(this.checkDuplicateTime(val,this.state.setTimeList)){
            var newArray = this.state.setTimeList.slice();    
            newArray.push(val);
            newArray.sort();
            this.onSubmit({projectId: 1,timeRanges:newArray})
        }else{
             this.setState({mss: 
                <div id='warning-duplicatetime'>
                    <Alert  color="warning" isOpen={this.state.visible} toggle={this.onDismiss}>
                        เวลาที่เลือกซ้ำกับที่เคยตั้งไว้
                    </Alert >
                </div>
                })
        }
    }

    onDismiss=()=>{
        this.setState({mss:''});
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

function mapStateToProps(state){
    return {
        fertilizerConfig: state.fertilizerReducers.fertilizerConfig
    }
}

export default connect(mapStateToProps)(FertilizerTimeList)