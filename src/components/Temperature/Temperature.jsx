import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { getTemp } from '../../redux/actions/weatherActions'
import { connect } from 'react-redux'
import TemperatureGauge from '../Temperature/TemperatureGauge'
import SettingTemperature from '../Temperature/SettingTemperature'
import { Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Temperature extends Component {

    componentDidMount() {
        this.props.dispatch(getTemp({ farmId: 123456789, greenHouseId: 25197568 }))
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
                                farmId={123456789}
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
        this.props.dispatch(getTemp({ farmId: 123456789, greenHouseId: 25197568 }))
    }
}

function mapStateToProps(state) {
    return {
        temp: state.weatherReducers.temp,
    }
}

export default connect(mapStateToProps)(Temperature)