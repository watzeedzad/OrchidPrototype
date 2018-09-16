import React, { Component } from 'react';
import { getProject } from '../../redux/actions/controllerActions'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap';
import ProjectControllerList from './ProjectControllerList'
import 'bootstrap/dist/css/bootstrap.min.css';

class ProjectTabs extends Component {

    componentDidMount() {
        this.props.dispatch(getProject({
            farmId: this.props.farmId, 
            greenHouseId: this.props.greenHouseId }))
    }

    render() {
        const { projects } = this.props

        if (projects.isRejected) {
            return <div className="alert alert-danger">Error: {projects.data}</div>
        }
        if (projects.isLoading) {
            return <div>Loading...</div>
        }

        return (
            <Container>
                <div>
                    <Row>
                        {projects.data && projects.data.map(e => {
                            return (
                                <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                                    <ProjectControllerList farmId={this.props.farmId}
                                        greenHouseId={this.props.greenHouseId}
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
        projects: state.controllerReducers.projects,
    }
}

export default connect(mapStateToProps)(ProjectTabs)