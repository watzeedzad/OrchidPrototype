import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { getGreenHouseController } from '../../redux/actions/controllerActions'
import GreenHouseControllerList from './GreenHouseControllerList';
import { UncontrolledAlert } from 'reactstrap';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
});

class GreenHouseTabs extends Component {
  state = {
    value: 0,
    mss: '',
  };

  componentDidMount() {
    this.props.dispatch(getGreenHouseController({ farmId: 123456789 }))
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes,gController } = this.props;
    const { value } = this.state;

    if (gController.isRejected) {
      return <div className="alert alert-danger">Error: {gController.data}</div>
    }
    if (gController.isLoading) {
      return <div>Loading...</div>
    }
    if (gController.data.errorMessage){
      return <div className="alert alert-danger">{gController.data.errorMessage}</div>
    }

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            scrollable
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            {gController.data && gController.data.map((e,index) => {
              let label = "โรงเรือนที่ "+(parseInt(index)+1)
              return (
                <Tab label={label} index/>
              )
            })}
          </Tabs>
        </AppBar>
        {gController.data && gController.data.map((e,index) => {
          return (
            value === index && 
            <TabContainer>
              <GreenHouseControllerList controllerList={gController.data} 
                onDelete={this.delete}
                mss={this.state.mss}/>
              <br/><br/><hr/>
            </TabContainer>
          )
        })}
     
      </div>
    );
  }

  delete = () => {
    this.setState({
        mss: 
            <div>
                <UncontrolledAlert  color="success">
                    ทำการลบคอนโทรลเลอร์สำเร็จ
                </UncontrolledAlert >
            </div>
    })
    this.props.dispatch(getGreenHouseController({ farmId: 123456789 }))
  }
}

function mapStateToProps(state) {
  return {
      gController: state.controllerReducers.gController,
  }
}

GreenHouseTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(GreenHouseTabs));
