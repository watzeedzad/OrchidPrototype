import React from 'react'
import Fertility from '../components/Fertility/Fertility'
import Sidebar from '../components/Sidebar/Drawers'
import { withStyles } from 'material-ui/styles';
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
  

function FertilityControl (props) {   
    const { classes } = props;
        return (
            <div className={classes.root}>
                <div>
                <Sidebar/>
                </div>
                <main className={classes.content}>
                <div className={classes.toolbar} />
                <Fertility />
                </main>
              
            </div>
        )
    
}

export default  withStyles(styles, { withTheme: true })(FertilityControl)