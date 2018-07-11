import React,{Component} from 'react';
import {Container,Row,Col,Alert} from 'reactstrap';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import ClockPiker from '../../Utils/ClockPicker';
import { Modal, ModalHeader} from 'reactstrap';
import { saveFertilizerConfig } from '../../redux/actions/fertilizerActions';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            const newArr = [];
            for(let i = 0 ;i< fertilizerTimeList.data.timeRanges.length;i++){
                const mills = fertilizerTimeList.data.timeRanges[i];
                const date = new Date(mills);
                newArr.push(date);
            }
            this.setState({setTimeList:newArr});
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
              <Col md='12'>
                {this.state.mss}
                <Button color='primary' onClick={()=> this.toggle()}>เพิ่มเวลา</Button>
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
                    {this.state.setTimeList > 0 && this.state.setTimeList.map(e=>{
                        let hour = e.getHours()<10? '0'+e.getHours():e.getHours();
                        let minute = e.getMinutes()<10? '0'+e.getMinutes():e.getMinutes();
                        return(
                            <Col md='12'>
                                {hour}:{minute} น. หรือ {this.tConvert(hour+":"+minute)}
                            </Col>
                        )
                    })}
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
            this.onSubmit({greenHouseId:789456123,timeRanges:newArray})
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