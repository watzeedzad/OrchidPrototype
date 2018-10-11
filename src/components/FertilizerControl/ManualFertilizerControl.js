import React, { Component } from 'react';
import { getFertility } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import FertilityGauge from '../Fertility/FertilityGauge'
import ManualFertilizerField from '../FertilizerControl/ManualFertilizerField'
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


class ManualFertilizerControl extends Component {

    
    constructor() {
        super();
    
        this.state = {
            intervalId : null,
        };
    }

    componentDidMount() {
        this.fetchData(0)
        var intervalId = setInterval( this.fetchData, 15000);
        this.setState({intervalId: intervalId});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.fertility.data !== null && nextProps.fertility.data !== null){
            return this.props.fertility.data.currentFertility !== nextProps.fertility.data.currentFertility
        }else{
            return true
        }
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.state.intervalId);
    }
    
    fetchData = (count) => {
        this.props.dispatch(getFertility({ projectId: 1 , count:count}))
    }

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
                            <ManualFertilizerField
                                projectId={1}
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
        this.fetchData(0)
    }
}

function mapStateToProps(state) {
    return {
        fertility: state.planterReducers.fertility,
    }
}

export default connect(mapStateToProps)(withStyles(styles)(ManualFertilizerControl));