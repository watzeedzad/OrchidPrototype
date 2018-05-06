import React, { Component } from 'react';
import { getHumidity } from '../../redux/actions/weatherActions'
import { connect } from 'react-redux'
import HumidityGauge from '../Humidity/HumidityGauge'
import SettingHumidity from '../Humidity/SettingHumidity'
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Humidity extends Component {

    componentDidMount() {
        this.props.dispatch(getHumidity({ greenHouseId: 789456123 }))
    }

    render() {
        const { humidity } = this.props
        const { data } = humidity

        if (humidity.isRejected) {
            return <div className="alert alert-danger">Error: {humidity.data}</div>
        }
        if (humidity.isLoading) {
            return <div>Loading...</div>
        }
        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <HumidityGauge
                                minConfig={data.minConfigHumidity}
                                maxConfig={data.maxConfigHumidity}
                                currentValue={data.currentHumidity}
                            />
                        </Col>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <SettingHumidity
                                minConfig={data.minConfigHumidity}
                                maxConfig={data.maxConfigHumidity}
                                onToggle={this.toggle}
                            />
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }

    toggle = () => {
        this.props.dispatch(getHumidity({ greenHouseId: 25197568 }))
    }
}

function mapStateToProps(state) {
    return {
        humidity: state.weatherReducers.humidity,
    }
}

export default connect(mapStateToProps)(Humidity)