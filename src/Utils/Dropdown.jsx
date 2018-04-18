import React ,{Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import MenuItem from "material-ui/Menu/MenuItem";
import classNames from 'classnames';


const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing.unit,
    },
    withoutLabel: {
      marginTop: theme.spacing.unit * 3,
    },
    textField: {
      flexBasis: 200,
    },
  });
  

const number =[
    {   
        label: '5',
        value:5
    },
    {
        label: '10',
        value:10
    },
    {
        label: '15',
        value:15
    },
    {
        label: '20',
        value:20
    },
    {
        label: '25',
        value:25
    },
    {
        label: '30',
        value:30
    },
    {
        label: '35',
        value:35
    },
    {
        label: '40',
        value:40
    },
    {
        label: '45',
        value:45
    },
    {
        label: '50',
        value:50
    }
];

class Dropdown extends Component{
    state = {
        number : 5
    };

    handleChange = prop => event=>{
        this.setState({[prop] : event.target.value});
    }

    render(){
        const {classes} = this.props ;

    return(
        <TextField
            select
            className={classNames(classes.margin,classes.TextField)}
            value = {this.state.number}
            onChange={this.handleChange('number')}
            >
                {number.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>         
        ) 
    }
}

export default withStyles(styles) (Dropdown);