import React, { Component } from 'react';
import Moisture from './Moisture'
import MoistureGraph from './MoistureGraph'
import { Container, Row, Col } from 'reactstrap';

class MoistureTab extends Component {
    render() {
        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <Moisture />
                        </Col>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <MoistureGraph />
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }
}

export default MoistureTab;