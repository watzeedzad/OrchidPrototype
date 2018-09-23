import React, { Component } from 'react';
import { getLightIntensity } from '../../redux/actions/lightActions'
import { connect } from 'react-redux'
import LightIntensityGauge from './LightIntensityGauge'
import SettingLightIntensity from './SettingLightIntensity'
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

class LightIntensity extends Component {

    componentDidMount() {
        this.props.dispatch(getLightIntensity({ greenHouseId: 789456123 }))
    }

    render() {
        const { classes,intensity } = this.props
        const { data } = intensity

        if (intensity.isRejected) {
            return <div className="alert alert-danger">Error: {intensity.data}</div>
        }
        if (intensity.isLoading) {
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
                            <LightIntensityGauge
                                minConfig={data.minLightIntensity}
                                maxConfig={data.maxLightIntensity}
                                currentValue={data.currentLightIntensity}
                            />
                        </Col>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <SettingLightIntensity
                                minConfig={data.minLightIntensity}
                                maxConfig={data.maxLightIntensity}
                                onToggle={this.toggle}
                            />
                        </Col>
                    </Row>
                    </Container>
                    </Paper>
                </main>
            </React.Fragment>
        )
    }

    toggle = () => {
        this.props.dispatch(getLightIntensity({ greenHouseId: 789456123 }))
    }
}

function mapStateToProps(state) {
    return {
        intensity: state.lightReducers.intensity,
    }
}

export default connect(mapStateToProps)(withStyles(styles)(LightIntensity))