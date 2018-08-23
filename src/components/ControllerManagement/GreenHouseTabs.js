import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

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
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    let  array  = [0, 1, 2, 3]
    let array2 = ["item1", "item2", "item3", "item4",]
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
            {array.map(e => {
              return (
                <Tab label={e}/>
              )
            })}
          </Tabs>
        </AppBar>
        {array2.map((e,index) => {
          return (
             value === index && <TabContainer>{e}</TabContainer>
          )
        })}
     
      </div>
    );
  }
}

GreenHouseTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GreenHouseTabs);
