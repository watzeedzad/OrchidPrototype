import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { manaulWatering } from '../../redux/actions/waterActions'
import renderField from '../../Utils/renderField'
import { Button, FormGroup, Form } from 'reactstrap';


class ManualWaterField extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "greenHouseId": this.props.greenHouseId,
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
                        <Field name="litre" component={renderField} type="number" label="ปริมาณน้ำที่จะให้" />
                        <Button color="primary" onClick={handleSubmit(this.onSubmit)}>ให้น้ำทันที</Button>
                        <Field name="greenHouseId" component={renderField} type="hidden" />
                    </FormGroup>
                </form>
            </div>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(manaulWatering(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let litre = parseFloat(values.litre)

    if (values.litre === "") {
        errors.litre = 'กรุณากรอกน้ำที่ต้องการให้';
    }else if(litre < 0){
        errors.litre = 'ปริมาณน้ำไม่สามารถติดลบได้';
    }else if(litre == 0){
        errors.litre = 'ปริมาณน้ำต้องมากกว่าศูนย์'
    }
    return errors;
}

const form = reduxForm({
    form: 'manaulWatering',
    validate
})

export default form(ManualWaterField);