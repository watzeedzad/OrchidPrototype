import React, { Component } from 'react';
import { getLightIntensity } from '../../redux/actions/lightActions'
import { connect } from 'react-redux'
import LightIntensityGauge from './LightIntensityGauge'
import SettingLightIntensity from './SettingLightIntensity'
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class LightIntensity extends Component {

    componentDidMount() {
        this.props.dispatch(getLightIntensity({ greenHouseId: 789456123 }))
    }

    render() {
        const { intensity } = this.props
        const { data } = intensity

        if (intensity.isRejected) {
            return <div className="alert alert-danger">Error: {intensity.data}</div>
        }
        if (intensity.isLoading) {
            return <div>Loading...</div>
        }
    
        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <LightIntensityGauge
                                minConfig={data.minLightIntensity}
                                maxConfig={data.maxLightIntensity}
                                currentValue={data.currentLightIntensity}
                            />
                        </Col>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <SettingLightIntensity
                                minConfig={data.minLightIntensity}
                                maxConfig={data.maxLightIntensity}
                                onToggle={this.toggle}
                            />
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }

    toggle = () => {
        this.props.dispatch(getLightIntensity({ greenHouseId: 789456123 }))
    }
}

function mapStateToProps(state) {
    return {
        intensity: state.lightReducers.intensity,
    }
}

export default connect(mapStateToProps)(LightIntensity)