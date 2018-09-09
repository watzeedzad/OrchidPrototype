import React, { Component } from 'react';
import { getProjectController } from '../../redux/actions/controllerActions'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap';
import ProjectControllerList from './ProjectControllerList'
import 'bootstrap/dist/css/bootstrap.min.css';

class ProjectTabs extends Component {

    componentDidMount() {
        this.props.dispatch(getProjectController({farmId: this.props.farmId, greenHouseId: this.props.greenHouseId }))
    }

    render() {
        const { pController } = this.props

        if (pController.isRejected) {
            return <div className="alert alert-danger">Error: {pController.data}</div>
        }
        if (pController.isLoading) {
            return <div>Loading...</div>
        }
        if (pController.data.errorMessage){
            return <div className="alert alert-danger">{pController.data.errorMessage}</div>
        }

        return (
            <Container>
                <div>
                    <Row>
                        {pController.data && pController.data.map(e => {
                            return (
                                <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                                    <ProjectControllerList controllerList={e}
                                        greenHouseId={e[0].greenHouseId}
                                        projectId={e[0].projectId}
                                        buttonCreate={this.props.buttonCreate} 
                                        buttonDelete={this.props.buttonDelete}
                                        buttonEdit={this.props.buttonEdit}/>
                                </Col>
                            )
                        })}
                    </Row>
                </div>
            </Container>
        )
    }

}

function mapStateToProps(state) {
    return {
        pController: state.controllerReducers.pController,
    }
}

export default connect(mapStateToProps)(ProjectTabs)