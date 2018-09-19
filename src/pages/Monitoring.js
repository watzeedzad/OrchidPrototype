import React from 'react'
import GrowthRateTab from '../components/Monitoring/GrowthRateTab'
import Sidebar from '../components/Sidebar/Drawers'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'


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
  

function Monitoring (props) {   
    const { classes } = props;
        return (
            <div className={classes.root}>
                <div>
                <Sidebar/>
                </div>
                <main className={classes.content}>
                <div className={classes.toolbar} />
                <GrowthRateTab />
                </main>
              
            </div>
        )
    
}

export default  withStyles(styles, { withTheme: true })(Monitoring)