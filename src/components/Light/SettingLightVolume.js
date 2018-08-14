import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { saveLightVolume } from '../../redux/actions/lightActions'
import renderField from '../../Utils/renderField'
import { Button, FormGroup, Form } from 'reactstrap';


class SettingLightVolume extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "greenHouseId": 789456123,
            "maxLightVolume": this.props.maxConfig,
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
                        <Field name="maxLightVolume" component={renderField} type="number" label="ปริมาณแสงที่ต้องการต่อวัน" />
                        <Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button>
                    </FormGroup>
                </form>
            </div>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(saveLightVolume(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let min = parseFloat(values.minLightVolume)
    let max = parseFloat(values.maxLightVolume)

    if (values.minLightVolume === "") {
        errors.maxLightVolume = 'ต้องกรอกปริมาณแสงที่ต้องการ';
    }else if(min < 0 || min > 60 ){
        errors.maxLightVolume = 'ปริมาณแสงที่ต้องการต้องอยู่ในช่วง 0-24 ชม.';
    }
    return errors;
}

const form = reduxForm({
    form: 'settingLightVolume',
    validate
})

export default form(SettingLightVolume);