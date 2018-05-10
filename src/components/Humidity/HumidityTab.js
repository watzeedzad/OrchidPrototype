import React, { Component } from 'react';
import Humidity from './Humidity'
import HumidityGraph from './HumidityGraph'
import { Container, Row, Col } from 'reactstrap';

class HumidityTab extends Component {
    render() {
        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <Humidity />
                        </Col>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <HumidityGraph />
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }
}

export default HumidityTab;