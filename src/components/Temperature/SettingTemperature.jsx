import React ,{Component} from 'react';
import { withStyles,Grid,Paper,Typography  } from 'material-ui';
import Dropdown from '../../Utils/Dropdown';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';


const styles = theme => ({
    
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 5,
      }),
  })
  

function SettingTemperature(props){
    const{classes} = props
    return(

        <Grid container>
         <Grid item xs={12} sm={12} md={12} ld={12} xl={12}>
            <Paper className={classes.root} styles={styles}>
                <Dropdown /> 
                <Dropdown />
                <Button vataint ="raised">
                    Send value
                </Button>
            </Paper>
            </Grid>

          
        </Grid>
    
    )
}

SettingTemperature.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  

export default withStyles(styles) (SettingTemperature);