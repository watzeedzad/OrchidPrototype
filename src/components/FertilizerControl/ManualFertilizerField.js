import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { manaulFertilizer } from '../../redux/actions/fertilizerActions'
import renderField from '../../Utils/renderField'
import { Button, FormGroup, Form } from 'reactstrap';


class ManualFertilizerField extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "projectId": this.props.projectId,
            "litre": 0,
        };
        this.props.initialize(initData);
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <div>
                <form>
                    <FormGroup >
                        <Field name="litre" component={renderField} type="number" label="ปริมาณปุ๋ยที่จะให้" />
                        <Button color="primary" onClick={handleSubmit(this.onSubmit)}>ให้ปุ๋ยทันที</Button>
                        <Field name="projectId" component={renderField} type="hidden" />
                    </FormGroup>
                </form>
            </div>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(manaulFertilizer(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let litre = parseFloat(values.litre)

    if (values.litre === "") {
        errors.litre = 'กรุณากรอกปุ๋ยที่ต้องการให้';
    }else if(litre < 0){
        errors.litre = 'ปริมาณปุ๋ยไม่สามารถติดลบได้';
    }else if(litre == 0){
        errors.litre = 'ปริมาณปุ๋ยต้องมากกว่าศูนย์'
    }
    return errors;
}

const form = reduxForm({
    form: 'manaulFertilizer',
    validate
})

export default form(ManualFertilizerField);