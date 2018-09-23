import React, { Component } from 'react';
import { getAllFertility, getFertility } from '../../redux/actions/planterActions'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap';
import Speedometer from '../../Utils/Speedometer'
import Button from '@material-ui/core/Button';
import { browserHistory } from 'react-router'
import { debounce } from 'lodash'
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
    },
  
});

class ShowAllFertility extends Component {

    componentDidMount() {
        this.props.dispatch(getAllFertility({ greenHouseId: 789456123 }))
    }

    render() {
        const { classes,fertilitys } = this.props
        const { data } = fertilitys

        if (fertilitys.isRejected) {
            return <div className="alert alert-danger">Error: {fertilitys.data}</div>
        }
        if (fertilitys.isLoading) {
            return <div>Loading...</div>
        }

        return (
            <React.Fragment>
            <CssBaseline />
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                    <Container>                
                    <Row>
                        {data.allFertility && data.allFertility.map(e => {
                            let projectId = e.projectId
                            return (
                                <Col xs='6' sm='6' md='6' lg='6' xl='6' key={e.projectId}>
                                    โปรเจ็คที่ : {e.projectId}
                                    <Speedometer
                                        title={"ปริมาณแร่ธาตุ ณ ปัจจุบัน"}
                                        min={0}
                                        max={100}
                                        minConfig={e.minFertility}
                                        maxConfig={e.maxFertility}
                                        currentValue={e.currentFertility}
                                        minColor={"#E8B79E"}
                                        midColor={"#D98559"}
                                        maxColor={"#BE5C2A"} />
                                    <Button color="primary"
                                        variant="raised"
                                        fullWidth
                                        onClick={debounce(() => 
                                            { this.props.dispatch(getFertility({ projectId })).then(()=>{
                                            browserHistory.push('/fertilityControl')
                                            }) },500)}>
                                        ตั้งค่า
                                    </Button>
                                    <br /><hr />
                                </Col>
                            )
                        })}
                    </Row>
                    </Container>
                    </Paper>
                </main>
            </React.Fragment>
        )
    }

}

function mapStateToProps(state) {
    return {
        fertilitys: state.planterReducers.fertilitys,
    }
}

export default connect(mapStateToProps)(withStyles(styles)(ShowAllFertility));