import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { saveTempConfig } from '../../redux/actions/weatherActions'
import renderField from '../../Utils/renderField'
import { Button, FormGroup, Form } from 'reactstrap';


class SettingTemperature extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "minTemperature": this.props.minConfig,
            "maxTemperature": this.props.maxConfig,
        };
        this.props.initialize(initData);
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <div>
                <Form inline>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Field name="minTemperature" component={renderField} type="number" label="ความชื้นต่ำสุด" />
                        <Field name="maxTemperature" component={renderField} type="number" label="ความชื้นสูงสุด" />
                        <Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button>
                    </FormGroup>
                </Form>
            </div>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(saveTempConfig(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let min = parseFloat(values.minTemperature)
    let max = parseFloat(values.maxTemperature)

    if (values.minTemperature === "") {
        errors.minTemperature = 'ต้องกรอกอุณหภูมิต่ำสุด';
    }else if(min < 0 || min > 60 ){
        errors.minTemperature = 'อุณหภูมิต้องอยู่ระหว่าง 0 - 60ํ  ํC ';
    }
    if (values.maxTemperature === "") {
        errors.maxTemperature = 'ต้องกรอกอุณหภูมิสูงสุด';
    }else if(max < 0 || max > 60 ){
        errors.maxTemperature = 'อุณหภูมิต้องอยู่ระหว่าง 0 - 60ํ  ํC ';
    }
    if(min > max ){
        errors.minTemperature = 'อุณหภูมิต่ำสุดต้องน้อยกว่าสูงสุด';
    }
    return errors;
}

const form = reduxForm({
    form: 'settingTemp',
    validate
})

export default form(SettingTemperature);