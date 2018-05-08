import React, { Component } from 'react';
import { getFertility } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import FertilityGauge from '../Fertility/FertilityGauge'
import SettingFertility from '../Fertility/SettingFertility'
import FertilityGraph from '../Fertility/FertilityGraph'
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Fertility extends Component {

    render() {
        const { fertility } = this.props
        const { data } = fertility

        if (fertility.isRejected) {
            return <div className="alert alert-danger">Error: {fertility.data}</div>
        }
        if (fertility.isLoading) {
            return <div>Loading...</div>
        }

        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <FertilityGauge
                                minConfig={data.minConfigFertility}
                                maxConfig={data.maxConfigFertility}
                                currentValue={data.currentFertility}
                            />
                        </Col>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <SettingFertility
                                minConfig={data.minConfigFertility}
                                maxConfig={data.maxConfigFertility}
                                onToggle={() => {this.props.dispatch(getFertility({ projectId: data.projectId }))}}
                            />
                        </Col>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <FertilityGraph projectId={data.projectId} />
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }

    // toggle = () => {
    //     this.props.dispatch(getFertility({ projectId: 2 }))
    // }
}

function mapStateToProps(state) {
    console.log(123)
    return {
        fertility: state.planterReducers.fertility,
    }
}

export default connect(mapStateToProps)(Fertility)