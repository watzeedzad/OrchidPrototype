import React, { Component } from 'react';
import { Field, reduxForm ,Form} from 'redux-form';
import { saveFertilityConfig } from '../../redux/actions/planterActions'
import renderField from '../../Utils/renderField'
import { Button, FormGroup } from 'reactstrap';


class SettingFertility extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "projectId": this.props.projectId,
            "minFertility": this.props.minConfig,
            "maxFertility": this.props.maxConfig,
        };
        this.props.initialize(initData);
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <div>
                <Form >
                    <FormGroup>
                        <Field name="projectId" component={renderField} type="hidden" />
                        <Field name="minFertility" component={renderField} type="number" label="ปริมาณแร่ธาตุต่ำสุด" />
                        <Field name="maxFertility" component={renderField} type="number" label="ปริมาณแร่ธาตุสูงสุด" />
                        <Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button>
                    </FormGroup>
                </Form>
            </div>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(saveFertilityConfig(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let min = parseFloat(values.minFertility)
    let max = parseFloat(values.maxFertility)

    if (values.minFertility === "") {
        errors.minFertility = 'ต้องกรอกปริมาณแร่ธาตุต่ำสุด';
    }else if(min < 0 || min > 100 ){
        errors.minFertility = 'ปริมาณแร่ธาตุต้องอยู่ระหว่าง 0 - 100 ';
    }
    if (values.maxFertility === "") {
        errors.maxFertility = 'ต้องกรอกปริมาณแร่ธาตุสูงสุด';
    }else if(max < 0 || max > 100 ){
        errors.maxFertility = 'ปริมาณแร่ธาตุต้องอยู่ระหว่าง 0 - 100 ';
    }
    if(min > max ){
        errors.minFertility = 'ปริมาณแร่ธาตุต่ำสุดต้องน้อยกว่าสูงสุด';
    }
    return errors;
}

const form = reduxForm({
    form: 'settingFertility',
    validate
})

export default form(SettingFertility);