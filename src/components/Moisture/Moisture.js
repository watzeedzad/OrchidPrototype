import React, { Component } from 'react';
import { getMoisture } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import MoistureGauge from '../Moisture/MoistureGauge'
import SettingMoisture from '../Moisture/SettingMoisture'
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Moisture extends Component {

    constructor() {
        super();
    
        this.state = {
            intervalId : null,
        };
    }

    componentDidMount() {
        this.fetchData(0)
        var intervalId = setInterval( this.fetchData, 15000);
        this.setState({intervalId: intervalId});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.moisture.data !== null && nextProps.moisture.data !== null){
            return this.props.moisture.data.currentSoilMoisture !== nextProps.moisture.data.currentSoilMoisture
        }else{
            return true
        }
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.state.intervalId);
    }
    
    fetchData = (count) => {
        this.props.dispatch(getMoisture({ greenHouseId: 789456123, count:count }))
    }

    render() {
        const { moisture } = this.props
        const { data } = moisture

        if (moisture.isRejected) {
            return <div className="alert alert-danger">Error: {moisture.data}</div>
        }
        if (moisture.isLoading) {
            return <div>Loading...</div>
        }
    
        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <MoistureGauge
                                minConfig={data.minConfigSoilMoisture}
                                maxConfig={data.maxConfigSoilMoisture}
                                currentValue={data.currentSoilMoisture}
                            />
                        </Col>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <SettingMoisture
                                minConfig={data.minConfigSoilMoisture}
                                maxConfig={data.maxConfigSoilMoisture}
                                onToggle={this.toggle}
                            />
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }

    toggle = () => {
        this.props.dispatch(getMoisture({ greenHouseId: 789456123 }))
    }
}

function mapStateToProps(state) {
    return {
        moisture: state.planterReducers.moisture,
    }
}

export default connect(mapStateToProps)(Moisture)