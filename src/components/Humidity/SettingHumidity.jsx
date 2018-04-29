import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { saveHumidityConfig } from '../../redux/actions/weatherActions'
import renderField from '../../Utils/renderField'
import { Button } from 'reactstrap';


class SettingHumidity extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "farmId": this.props.farmId,
            "minHumidity": this.props.minConfig,
            "maxHumidity": this.props.maxConfig,
        };
        this.props.initialize(initData);
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <div>
                <table>
                    <tr>
                        <form>
                            <Field name="farmId" component={renderField} type="hidden" />
                            <td><Field name="minHumidity" component={renderField} type="number" label="ความชื้นต่ำสุด" /></td>
                            <td><Field name="maxHumidity" component={renderField} type="number" label="ความชื้นสููงสุด" /></td>
                            <td><Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button></td>
                        </form>
                    </tr>
                </table>               
            </div>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(saveHumidityConfig(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    if (values.minTemperature === "") {
        errors.minTemperature = 'ต้องเลือกความชื้นต่ำสุด';
    }
    if (values.maxTemperature === "") {
        errors.maxTemperature = 'ต้องเลือกความชื้นสูงสุด';
    }
    return errors;
}

const form = reduxForm({
    form: 'settingHumidity',
    validate
})

export default form(SettingHumidity);