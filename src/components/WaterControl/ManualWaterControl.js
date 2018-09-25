import React, { Component } from 'react';
import { getMoisture } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import MoistureGauge from '../Moisture/MoistureGauge'
import ManualWaterField from '../WaterControl/ManualWaterField'
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

class ManualWaterControl extends Component {

    
    constructor() {
        super();
    
        this.state = {
            intervalId : null,
        };
    }

    componentDidMount() {
        this.fetchData()
        var intervalId = setInterval( this.fetchData, 150000);
        this.setState({intervalId: intervalId});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.moisture.data != null) {
            return this.props.moisture.data != nextProps.moisture.data
        }
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.state.intervalId);
    }
    
    fetchData = () => {
        this.props.dispatch(getMoisture({ greenHouseId: 789456123 }))
    }

    render() {
        const { classes,moisture } = this.props
        const { data } = moisture

        if (moisture.isRejected) {
            return <div className="alert alert-danger">Error: {moisture.data}</div>
        }
        if (moisture.isLoading) {
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
                            <MoistureGauge
                                minConfig={data.minConfigSoilMoisture}
                                maxConfig={data.maxConfigSoilMoisture}
                                currentValue={data.currentSoilMoisture}
                            />
                        </Col>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <ManualWaterField
                                greenHouseId={789456123}
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
        this.props.dispatch(getMoisture({ greenHouseId: 789456123 }))
    }
}

function mapStateToProps(state) {
    return {
        moisture: state.planterReducers.moisture,
    }
}

export default connect(mapStateToProps)(withStyles(styles)(ManualWaterControl));