import React, { Component } from 'react';
import { getTemp } from '../../redux/actions/weatherActions'
import { connect } from 'react-redux'
import TemperatureGauge from '../Temperature/TemperatureGauge'
import SettingTemperature from '../Temperature/SettingTemperature'
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Temperature extends Component {

    constructor() {
        super();
    
        this.state = {
            intervalId : null,
        };
    }

    componentDidMount() {
        this.fetchData()
        var intervalId = setInterval( this.fetchData, 150000);
        this.setState({intervalId: intervalId});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.temp.data != null) {
            return this.props.temp.data != nextProps.temp.data
        }
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.state.intervalId);
    }
    
    fetchData = () => {
        this.props.dispatch(getTemp({ greenHouseId: 789456123 }))
    }

    render() {
        const { temp } = this.props
        const { data } = temp

        if (temp.isRejected) {
            return <div className="alert alert-danger">Error: {temp.data}</div>
        }
        if (temp.isLoading) {
            return <div>Loading...</div>
        }
        if (data.errorMessage){
            return <div className="alert alert-danger">{data.errorMessage}</div>
        }
    
        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <TemperatureGauge
                                minConfig={data.minConfigTemperature}
                                maxConfig={data.maxConfigTemperature}
                                currentValue={data.currentTemperature}
                            />
                        </Col>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <SettingTemperature
                                minConfig={data.minConfigTemperature}
                                maxConfig={data.maxConfigTemperature}
                                onToggle={this.toggle}
                            />
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }

    toggle = () => {
        this.props.dispatch(getTemp({ greenHouseId: 789456123 }))
    }
}

function mapStateToProps(state) {
    return {
        temp: state.weatherReducers.temp,
    }
}

export default connect(mapStateToProps)(Temperature)