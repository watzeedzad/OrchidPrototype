import React, { Component } from 'react';
import { getAllFertility } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap';
import Speedometer from '../../Utils/Speedometer'
import { Button } from 'reactstrap';
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
                            return (
                                <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                                    <Speedometer
                                        min={0}
                                        max={100}
                                        minConfig={data.minConfigFertility}
                                        maxConfig={data.maxConfigFertility}
                                        currentValue={e.currentFertility}
                                        minColor={"#C7F3FF"}
                                        midColor={"#51DBFF"}
                                        maxColor={"#00B9E9"} />
                                    <Button><a href="">ตั้งค่า</a></Button>
                                </Col>
                            )
                        })}
                    </Row>
                </div>
            </Container>
        )
    }

    toggle = () => {
        this.props.dispatch(getAllFertility({ greenHouseId: 25197568 }))
    }
}

function mapStateToProps(state) {
    return {
        fertilitys: state.planterReducers.fertilitys,
    }
}

export default connect(mapStateToProps)(ShowAllFertility)