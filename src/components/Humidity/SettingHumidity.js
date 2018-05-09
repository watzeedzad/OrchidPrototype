import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { saveHumidityConfig } from '../../redux/actions/weatherActions'
import renderField from '../../Utils/renderField'
import { Button, FormGroup } from 'reactstrap';


class SettingHumidity extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "minHumidity": this.props.minConfig,
            "maxHumidity": this.props.maxConfig,
        };
        this.props.initialize(initData);
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <div>
                <form >
                    <FormGroup>
                        <Field name="minHumidity" component={renderField} type="number" label="ความชื้นต่ำสุด" />
                        <Field name="maxHumidity" component={renderField} type="number" label="ความชื้นสูงสุด" />
                        <Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button>
                    </FormGroup>
                </form>
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
    let min = parseFloat(values.minHumidity)
    let max = parseFloat(values.maxHumidity)

    if (values.minHumidity === "") {
        errors.minHumidity = 'ต้องกรอกความชื้นต่ำสุด';
    }else if(min < 0 || min > 100 ){
        errors.minHumidity = 'ความชื้นต้องอยู่ระหว่าง 0 - 100 ';
    }
    if (values.maxHumidity === "") {
        errors.maxHumidity = 'ต้องกรอกความชื้นสูงสุด';
    }else if(max < 0 || max > 100 ){
        errors.maxHumidity = 'ความชื้นต้องอยู่ระหว่าง 0 - 100 ';
    }
    if(min > max ){
        errors.minHumidity = 'ความชื้นต่ำสุดต้องน้อยกว่าสูงสุด';
    }
    return errors;
}

const form = reduxForm({
    form: 'settingHumidity',
    validate
})

export default form(SettingHumidity);