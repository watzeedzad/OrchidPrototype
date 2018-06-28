import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import WateringTimeList from '../WaterControl/WateringTimeList'

class AutoWaterControl extends Component {

    render() {
        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            
                            <WateringTimeList/>
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }

}

export default AutoWaterControl;