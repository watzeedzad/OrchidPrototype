import React,{Component} from 'react';
import {connect} from 'react-redux';
import {UncontrolledAlert} from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import FertilizerTimeList from '../FertilizerControl/FertilizerTimeList';
import { getFertilizerTime } from '../../redux/actions/fertilizerActions'

class AutoFertilizerControl extends Component{
    
    constructor(props){
        super(props);
        this.state={
            mss:'',
            visible:true
        }
    }

    componentDidMount(){
        this.props.dispatch(getFertilizerTime({ projectId: 1 }))
    }

    render(){
        const {fertilizerTimeList} = this.props;

        if(fertilizerTimeList.isRejected){
            return  <div className="alert alert-danger">Error: {fertilizerTimeList.data}</div>
        }

        if(fertilizerTimeList.isLoading){
            return <div>Loading...</div>
        }

        if(fertilizerTimeList.data.errorMessage){
            return <div className="alert alert-danger">Error: {fertilizerTimeList.data.errorMessage}</div>
        }

        return(
            <Container>
                <div id="FertilizerTimeList-content">
                    <Row>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <FertilizerTimeList fertilizerTimeList={fertilizerTimeList} onToggle={this.toggle} mss={this.state.mss}/>
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }
    
    toggle = ()=>{
        this.setState({
            mss:
                <div>
                    <UncontrolledAlert color='success'>
                        บันทึกการตั้งค่าเวลาการให้ปุ๋ยสำเร็จ
                    </UncontrolledAlert>
                </div>
            });
            this.props.dispatch(getFertilizerTime({ projectId: 1}))
        }
    
}

function mapStateToProps(state) {
    return {
        fertilizerTimeList: state.fertilizerReducers.fertilizerTimeList
    }
}

export default connect(mapStateToProps)(AutoFertilizerControl);