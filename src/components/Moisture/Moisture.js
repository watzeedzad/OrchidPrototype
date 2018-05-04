import React, { Component } from 'react';
import { getMoisture } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import MoistureGauge from '../Moisture/MoistureGauge'
import SettingMoisture from '../Moisture/SettingMoisture'
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Moisture extends Component {

    componentDidMount() {
        this.props.dispatch(getMoisture({ greenHouseId: 25197568 }))
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
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
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
        this.props.dispatch(getMoisture({ greenHouseId: 25197568 }))
    }
}

function mapStateToProps(state) {
    return {
        moisture: state.planterReducers.moisture,
    }
}

export default connect(mapStateToProps)(Moisture)