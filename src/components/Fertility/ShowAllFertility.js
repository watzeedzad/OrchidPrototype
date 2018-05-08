import React, { Component } from 'react';
import { getAllFertility, getFertility } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap';
import Speedometer from '../../Utils/Speedometer'
import { Button } from 'reactstrap';
import { browserHistory } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css';

class ShowAllFertility extends Component {

    componentDidMount() {
        this.props.dispatch(getAllFertility({ greenHouseId: 789456123 }))
    }

    render() {
        const { fertilitys } = this.props
        const { data } = fertilitys

        if (fertilitys.isRejected) {
            return <div className="alert alert-danger">Error: {fertilitys.data}</div>
        }
        if (fertilitys.isLoading) {
            return <div>Loading...</div>
        }

        return (
            <Container>
                <div>
                    <Row>
                        {data.allFertility && data.allFertility.map(e => {
                            let projectId = e.projectId
                            return (
                                <Col xs='6' sm='6' md='6' lg='6' xl='6' key={e.projectId}>
                                    โปรเจ็คที่ : {e.projectId}
                                    <Speedometer
                                        min={0}
                                        max={100}
                                        minConfig={data.minConfigFertility}
                                        maxConfig={data.maxConfigFertility}
                                        currentValue={e.currentFertility}
                                        minColor={"#E8B79E"}
                                        midColor={"#D98559"}
                                        maxColor={"#BE5C2A"} />
                                    <Button color="primary" onClick={() => { this.props.dispatch(getFertility({ projectId })) }}>ตั้งค่า</Button>
                                    <br /><hr />
                                </Col>
                            )
                        })}
                    </Row>
                </div>
            </Container>
        )
    }

    onSubmit = (values) => {
        console.log(values)
        this.props.dispatch(getFertility({ values }))
    }
}

function mapStateToProps(state) {
    return {
        fertilitys: state.planterReducers.fertilitys,
    }
}

export default connect(mapStateToProps)(ShowAllFertility)