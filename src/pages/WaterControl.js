import React, { Component } from 'react'
import Sidebar from '../components/Sidebar/Drawers'
import { withStyles } from '@material-ui/core/styles';
import AutoWaterControl from '../components/WaterControl/AutoWaterControl';

const styles = theme => ({
    root: {
      flexGrow: 1,
      zIndex: 1,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
      },
      toolbar: theme.mixins.toolbar,
    });
function WaterControl(props){    
    const { classes } = props;

        return (
            <div className={classes.root}>
                <div>
                    <Sidebar/>
                </div>
                <main className={classes.content}>
                <div className={classes.toolbar} />
                <AutoWaterControl/>
                </main>
            </div>
        )
    
}

export default withStyles(styles, { withTheme: true })(WaterControl)