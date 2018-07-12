import React from 'react'
import Sidebar from '../components/Sidebar/Drawers'
import { withStyles } from '@material-ui/core/styles';
import AutoFertilizerControl from '../components/FertilizerControl/AutoFertilizerControl';
import ManualFertilizerControl from '../components/FertilizerControl/ManualFertilizerControl'


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

function FertilizerControl(props){
    const {classes} = props;

    return(

        <div className={classes.root} id='page-fertilizercontrol'>
            <div id='sidebar'>
                <Sidebar/>
            </div>
            
                <main className={classes.content}>
                <div className={classes.toolbar} id='toolbar' />
                <AutoFertilizerControl/><br/><hr/>
                <ManualFertilizerControl/>
                </main>
            
        </div>
    )
}

export default withStyles(styles,{withTheme:true})(FertilizerControl);

