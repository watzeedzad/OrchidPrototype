import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import ClockPiker from '../../Utils/ClockPicker';

class AutoWaterControl extends Component {
    render() {
        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <ClockPiker/>
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }
}

export default AutoWaterControl;