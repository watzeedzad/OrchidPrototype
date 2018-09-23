import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import LightIntensity from './LightIntensity';
import LightVolume from './LightVolume';

class LightTab extends Component {
    render() {
        return (
            <Container>
                <div>
                    <Row>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <LightIntensity /><br/><hr/>
                        </Col>                  
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <LightVolume />
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }
}

export default LightTab;