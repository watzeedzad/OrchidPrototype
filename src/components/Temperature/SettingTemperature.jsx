import React, { Component } from 'react';
import { withStyles, Grid, Paper } from 'material-ui';
import Dropdown from '../../Utils/Dropdown';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import RaisedButton from '../../Utils/RaisedButton';
import { Field, reduxForm } from 'redux-form';
import { browserHistory } from 'react-router'
import { saveConfig } from '../../redux/actions/weatherActions'
import { connect } from 'react-redux'


const styles = theme => ({

    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 5,
    }),
})

class SettingTemperature extends Component {
    render() {
        const { handleSubmit,classes,configSave } = this.props
        const { data } = configSave
        
        if (configSave.isRejected) {
            return <div className="alert alert-danger">Error: {data}</div>
        }
        // if (configSave.isLoading) {
        //     return <div>Loading...</div>
        // }
        return (            
             <Grid container>
                 <Grid item xs="5">
                    <Paper className={classes.root} styles={styles}>
                         <table>
                            <tr>
                                <form>
                                    <input name="farmId" type="hidden" value={123456789} />
                                    <td><Field fieldName="minTemperature" component={Dropdown} inputlabel="อุณหภูมิต่ำสุด" textarea /></td>
                                    <td><Field fieldName="maxTemperature" component={Dropdown} inputlabel="อุณหภูมิสูงสุด" textarea /></td>
                                    <td><Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button></td>
                                    {/* <td><Button component={RaisedButton} ></Button></td> */}
                                </form>
                            </tr>
                        </table>
                    </Paper>
                 </Grid>
             </Grid>
        )
    }

    onSubmit = (values) =>{
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /work
        this.props.dispatch(saveConfig(values)).then(() => {
            browserHistory.push('/')
        })
    }
}




function validate(values) {
    const errors = {};
    if (values.minTemperature === "") {
        errors.minTemperature = 'ต้องเลือกอุณหภูมิต่ำสุด';
    }
    if (values.maxTemperature === "") {
        errors.maxTemperature = 'ต้องเลือกอุณหภูมิสูงสุด';
    }
    return errors;
}

const form = reduxForm({
    form: 'weatherControl',
    validate
})

SettingTemperature.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        configSave: state.weatherReducers.configSave
    }
}

export default connect(mapStateToProps)(withStyles(styles)(form(SettingTemperature)));