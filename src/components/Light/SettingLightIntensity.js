import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { saveLightIntensity } from '../../redux/actions/lightActions'
import renderField from '../../Utils/renderField'
import { Button, FormGroup, Form } from 'reactstrap';


class SettingLightIntensity extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "greenHouseId": 789456123,
            "minLightIntensity": this.props.minConfig,
            "maxLightIntensity": this.props.maxConfig,
        };
        this.props.initialize(initData);
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <div>
                <form>
                    <FormGroup >
                        <Field name="greenHouseId" component={renderField} type="hidden" />
                        <Field name="minLightIntensity" component={renderField} type="number" label="ความเข้มแสงต่ำสุด" />
                        <Field name="maxLightIntensity" component={renderField} type="number" label="ความเข้มแสงสูงสุด" />
                        <Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button>
                    </FormGroup>
                </form>
            </div>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(saveLightIntensity(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let min = parseFloat(values.minLightIntensity)
    let max = parseFloat(values.maxLightIntensity)

    if (values.minLightIntensity === "") {
        errors.minLightIntensity = 'ต้องกรอกความเข้มแสงต่ำสุด';
    }else if(min < 0 || min > 60 ){
        errors.minLightIntensity = 'ความเข้มแสงต้องอยู่ระหว่าง 0 - 100 ';
    }
    if (values.maxLightIntensity === "") {
        errors.maxLightIntensity = 'ต้องกรอกความเข้มแสงสูงสุด';
    }else if(max < 0 || max > 60 ){
        errors.maxLightIntensity = 'ความเข้มแสงต้องอยู่ระหว่าง 0 - 100 ';
    }
    if(min > max ){
        errors.minLightIntensity = 'ความเข้มแสงต่ำสุดต้องน้อยกว่าสูงสุด';
    }
    return errors;
}

const form = reduxForm({
    form: 'settingLightIntensity',
    validate
})

export default form(SettingLightIntensity);