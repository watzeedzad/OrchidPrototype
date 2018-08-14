import React, { Component } from 'react';
import { getLightVolume } from '../../redux/actions/lightActions'
import { connect } from 'react-redux'
import LightVolumeGauge from './LightVolumeGauge'
import SettingLightVolume from './SettingLightVolume'
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class LightVolume extends Component {

    componentDidMount() {
        this.props.dispatch(getLightVolume({ greenHouseId: 789456123 }))
    }

    render() {
        const { volume } = this.props
        const { data } = volume

        if (volume.isRejected) {
            return <div className="alert alert-danger">Error: {volume.data}</div>
        }
        if (volume.isLoading) {
            return <div>Loading...</div>
        }
        
        var currentProgress = Math.floor((data.currentLightVolume/data.maxLightVolume)*100)

        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            ปริมาณแสงที่ได้รับ {data.currentLightVolume} ชม./{data.maxLightVolume} ชม.
                            <LightVolumeGauge
                                currentProgress={currentProgress}
                            />
                        </Col>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <SettingLightVolume
                                maxConfig={data.maxLightVolume}
                                onToggle={this.toggle}
                            />
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }

    toggle = () => {
        this.props.dispatch(getLightVolume({ greenHouseId: 789456123 }))
    }
}

function mapStateToProps(state) {
    return {
        volume: state.lightReducers.volume,
    }
}

export default connect(mapStateToProps)(LightVolume)