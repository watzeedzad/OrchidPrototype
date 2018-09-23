import React, { Component } from 'react';
import { getFertility } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import FertilityGauge from '../Fertility/FertilityGauge'
import SettingFertility from '../Fertility/SettingFertility'
import FertilityGraph from '../Fertility/FertilityGraph'
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    layout: {
      width: 'auto',
      display: 'block', // Fix IE11 issue.
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(1200 + theme.spacing.unit * 3 * 2)]: {
        width: 1200,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing.unit * 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    headName:{
      margin: theme.spacing.unit,
    }
  
});

class Fertility extends Component {

    render() {
        const { classes,fertility } = this.props
        const { data } = fertility

        if (fertility.isRejected) {
            return <div className="alert alert-danger">Error: {fertility.data}</div>
        }
        if (fertility.isLoading) {
            return <div>Loading...</div>
        }

        return (
            <React.Fragment>
            <CssBaseline />
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                    <Container>               
                    <Row>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <FertilityGauge
                                minConfig={data.minConfigFertility}
                                maxConfig={data.maxConfigFertility}
                                currentValue={data.currentFertility}
                            />
                        </Col>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <SettingFertility
                                minConfig={data.minConfigFertility}
                                maxConfig={data.maxConfigFertility}
                                projectId={data.projectId}
                                onToggle={() => {this.props.dispatch(getFertility({ projectId: data.projectId }))}}
                            />
                        </Col>
                        <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                            <FertilityGraph projectId={data.projectId} />
                        </Col>
                    </Row>              
                    </Container>
                    </Paper>
                </main>
            </React.Fragment>
        )
    }

}

function mapStateToProps(state) {
    console.log(123)
    return {
        fertility: state.planterReducers.fertility,
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Fertility));