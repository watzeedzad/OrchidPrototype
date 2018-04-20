import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class RaisedButtons extends Component {
  state = {
    onClick: this.props.onClick,
  }
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button variant="raised" className={classes.button}>
          บันทึก
      </Button>
      </div>
    )

  }
}

RaisedButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RaisedButtons);
