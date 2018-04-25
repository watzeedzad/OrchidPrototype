import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { browserHistory } from 'react-router'
import { saveTempConfig, getTempConfig } from '../../redux/actions/weatherActions'
import { connect } from 'react-redux'
import renderField from '../../Utils/renderField'
import { Button } from 'reactstrap';


class SettingTemperature extends Component {
    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "farmId": this.props.farmId,
            "minTemperature": this.props.minConfig,
            "maxTemperature": this.props.maxConfig,
        };
        this.props.initialize(initData);
    }

    render() {
        const { handleSubmit, tempConfigSave } = this.props

        return (
                        <table>
                            <tr>
                                <form>
                                    <Field name="farmId" component={renderField} type="hidden" />
                                    <td><Field name="minTemperature" component={renderField} type="number" label="อุณหภูมิต่ำสุด" /></td>
                                    <td><Field name="maxTemperature" component={renderField} type="number" label="อุณหภูมิสููงสุด" /></td>
                                    <td><Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button></td>
                                </form>
                            </tr>
                        </table>
        )
    }
    
    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        console.log(values);
        this.props.dispatch(saveTempConfig(values)).then(() => {
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
    form: 'settingTemp',
    validate
})

function mapStateToProps(state) {
    return {
        tempConfigSave: state.weatherReducers.tempConfigSave,
    }
}

export default connect(mapStateToProps)(form(SettingTemperature));