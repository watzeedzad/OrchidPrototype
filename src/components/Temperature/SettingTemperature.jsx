import React, { Component } from 'react';
import { withStyles, Grid, Paper, Typography } from 'material-ui';
import Dropdown from '../../Utils/Dropdown';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import RaisedButton from '../../Utils/RaisedButton';
import { Field, reduxForm } from 'redux-form';


const styles = theme => ({

    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 5,
    }),
})

function SettingTemperature(props) {

    const { classes } = props
    return (
        <Grid container>
            <Grid item xs="5">
                <Paper className={classes.root} styles={styles}>
                    <table>
                        <tr>

                            <form>
                                <td><Field name="tempMin" component={Dropdown} inputlabel="อุณหภูมิต่ำสุด" textarea /></td>
                                <td><Field name="tempMax" component={Dropdown} inputlabel="อุณหภูมิสูงสุด" textarea /></td>
                                <td><Button component={RaisedButton} ></Button></td>                               
                            </form>
                        </tr>
                    </table>
                </Paper>
            </Grid>
        </Grid>
    )

    
}

function onSubmit(values) {
    //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /work
    // this.props.dispatch(saveWork(values)).then(() => {
    //     browserHistory.push('/WeatherControl')
    // })
}

function validate(values) {
    const errors = {};
    if (values.tempMin === "") {
        errors.location_id = 'ต้องเลือกอุณหภูมิต่ำสุด';
    }
    if (values.tempMin === "") {
        errors.detail = 'ต้องเลือกอุณหภูมิสูงสุด';
    }
    return errors;
}

const form = reduxForm({
    form: 'workUser',
    validate
})

SettingTemperature.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(form(SettingTemperature));