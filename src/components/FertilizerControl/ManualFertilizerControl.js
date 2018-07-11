import React, { Component } from 'react';
import { getFertility } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import FertilityGauge from '../Fertility/FertilityGauge'
import ManualFertilizerField from '../FertilizerControl/ManualFertilizerField'
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class ManualFertilizerControl extends Component {

    componentDidMount() {
        this.props.dispatch(getFertility({ projectId: 1 }))
    }

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
                            <ManualFertilizerField
                                projectId={1}
                                onToggle={this.toggle}
                            />
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }

    toggle = () => {
        this.props.dispatch(getFertility({ projectId: 1 }))
    }
}

function mapStateToProps(state) {
    return {
        fertility: state.planterReducers.fertility,
    }
}

export default connect(mapStateToProps)(ManualFertilizerControl)