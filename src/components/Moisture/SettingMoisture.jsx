import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { saveMoistureConfig } from '../../redux/actions/planterActions'
import renderField from '../../Utils/renderField'
import { Button, FormGroup, Form } from 'reactstrap';


class SettingMoisture extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "minSoilMoisture": this.props.minConfig,
            "maxSoilMoisture": this.props.maxConfig,
        };
        this.props.initialize(initData);
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <div>
                <Form className='form-inline'>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Field name="minSoilMoisture" component={renderField} type="number" label="ความชื้นต่ำสุด" />
                        <Field name="maxSoilMoisture" component={renderField} type="number" label="ความชื้นสูงสุด" />
                        <Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button>
                    </FormGroup>
                </Form>
            </div>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(saveMoistureConfig(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let min = parseFloat(values.minSoilMoisture)
    let max = parseFloat(values.maxSoilMoisture)

    if (values.minSoilMoisture === "") {
        errors.minSoilMoisture = 'ต้องกรอกความชื้นต่ำสุด';
    }else if(min < 0 || min > 60 ){
        errors.minSoilMoisture = 'ความชื้นต้องอยู่ระหว่าง 0 - 60ํ  ํC ';
    }
    if (values.maxSoilMoisture === "") {
        errors.maxSoilMoisture = 'ต้องกรอกความชื้นสูงสุด';
    }else if(max < 0 || max > 60 ){
        errors.maxSoilMoisture = 'ความชื้นต้องอยู่ระหว่าง 0 - 60ํ  ํC ';
    }
    if(min > max ){
        errors.minSoilMoisture = 'ความชื้นต่ำสุดต้องน้อยกว่าสูงสุด';
    }
    return errors;
}

const form = reduxForm({
    form: 'settingMoisture',
    validate
})

export default form(SettingMoisture);