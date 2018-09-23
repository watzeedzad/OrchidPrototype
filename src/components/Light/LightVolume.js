import React, { Component } from 'react';
import { getLightVolume } from '../../redux/actions/lightActions'
import { connect } from 'react-redux'
import LightVolumeGauge from './LightVolumeGauge'
import SettingLightVolume from './SettingLightVolume'
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

class LightVolume extends Component {

    componentDidMount() {
        this.props.dispatch(getLightVolume({ greenHouseId: 789456123 }))
    }

    render() {
        const { classes,volume } = this.props
        const { data } = volume

        if (volume.isRejected) {
            return <div className="alert alert-danger">Error: {volume.data}</div>
        }
        if (volume.isLoading) {
            return <div>Loading...</div>
        }
        
        var currentProgress = Math.floor((data.currentLightVolume/data.maxLightVolume)*100)

        return (
            <React.Fragment>
            <CssBaseline />
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                    <Container>
                    <Row>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            ปริมาณแสงที่ได้รับ {data.currentLightVolume} ชม./{data.maxLightVolume} ชม.
                            <LightVolumeGauge
                                currentProgress={currentProgress}
                            />
                        </Col>
                        <Col xs='6' sm='6' md='6' lg='6' xl='6'>
                            <SettingLightVolume
                                maxConfig={data.maxLightVolume}
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
        this.props.dispatch(getLightVolume({ greenHouseId: 789456123 }))
    }
}

function mapStateToProps(state) {
    return {
        volume: state.lightReducers.volume,
    }
}

export default connect(mapStateToProps)(withStyles(styles)(LightVolume))