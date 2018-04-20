import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input,{InputLabel} from 'material-ui/Input';
import {FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';
import RaisedButton from './RaisedButton';


const styles = theme =>({
    root:{
        display:'flex',
        flexWrap:'wrap'
    },
    formControl:{
        margin: theme.spacing.unit,
        minWidth:120,
    },
    selectEmpty:{
        marginTop: theme.spacing.unit * 2
    },
});

class Dropdown extends Component{

    state  = {
        temperature:'',
        inputlabel:''
    }
    
    componentDidMount() {
        this.setState({inputlabel:this.props.inputlabel});
    }

    handleChange = prop => event =>{
        this.setState({[prop]: event.target.value});
    }

    render(){
        const{classes} = this.props;


        return(
            <div className={classes.root}>
                <FormControl className={classes.formControl}>
                    <InputLabel>{this.state.inputlabel}</InputLabel>
                    <Select
                        native
                        value={this.state.temperatureMin}
                        onChange={this.handleChange('temperature')}
                    >
                        <option value=""/>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                        <option value={30}>30</option>
                        <option value={35}>35</option>
                        <option value={40}>40</option>
                        <option value={45}>45</option>
                        <option value={50}>50</option>
                    </Select>
                </FormControl>              
            </div>
        )
    }
}

Dropdown.propTypes={
    classes:PropTypes.object.isRequired,
};

export default withStyles(styles) (Dropdown);