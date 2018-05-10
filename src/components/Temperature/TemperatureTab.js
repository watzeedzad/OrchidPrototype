import React, { Component } from 'react';
import Temperature from './Temperature'
import TemperatureGraph from './TemperatureGraph'
import { Container, Row, Col } from 'reactstrap';

class TemperatureTab extends Component {
    render() {
        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <Temperature />
                        </Col>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <TemperatureGraph />
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }
}

export default TemperatureTab;