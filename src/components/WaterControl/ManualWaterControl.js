import React, { Component } from 'react';
import { getMoisture } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import MoistureGauge from '../Moisture/MoistureGauge'
import ManualWaterField from '../WaterControl/ManualWaterField'
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class ManualWaterControl extends Component {

    componentDidMount() {
        this.props.dispatch(getMoisture({ greenHouseId: 789456123 }))
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
                            <ManualWaterField
                                greenHouseId={789456123}
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

export default connect(mapStateToProps)(ManualWaterControl)