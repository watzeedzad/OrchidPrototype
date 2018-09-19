import React, { Component } from 'react'
import { Button, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import renderField from '../../Utils/renderField'

class GrowthRateForm extends Component {

    constructor() {
        super();
    
        this.state = {
            role: 'เจ้าของฟาร์ม',
        }
    }


    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการกำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    //กำหนดค่า value ให้กับ textbox หรือ control ต่างๆ ในฟอร์ม
    //ถ้าเป็น HTML ธรรมดาก็จะกำหนดเป็น value="xxx" แต่สำหรับ redux-form
    //ต้องใช้ initialize ถ้าเป็น redux-form v.6 ต้องประกาศใช้ initialize แต่ v.7 เรียกใช้ได้เลย
    handleInitialize() {
        let initData = {
            "greenHouseId": this.props.data.greenHouseId,
            "projectId": this.props.data.projectId,
            "timeStamp": new Date().toJSON().slice(0,10).replace(/-/g,'/'),
            "trunkDiameter": '',
            "leafWidth": '',
            "totalLeaf": '',
            "height": ''
        };

        this.props.initialize(initData);
    }

    render() {
        //redux-form จะมี props ที่ชื่อ handleSubmit เพื่อใช้ submit ค่า
        const { handleSubmit, growthRateSave } = this.props
        return (
            <div>
                <ModalBody>
                    {/* ตรวจสอบว่ามี err หรือไม่ */}
                    {growthRateSave.isRejected && <div className="alert alert-danger">{growthRateSave.data}</div>}

                    <Field name="timeStamp" component={renderField} type="text" label="วันที่" readOnly/> 
                    <Field name="trunkDiameter" component={renderField} type="text" label="เส้นผ่านศูนย์กลางลำต้น" autoFocus />
                    <Field name="leafWidth" component={renderField} type="text" label="ความกว้างใบ" />
                    <Field name="totalLeaf" component={renderField} type="text" label="จำนวนใบ" />
                    <Field name="height" component={renderField} type="text" label="ความสูง" />
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>ยกเลิก</Button>
                </ModalFooter>
            </div>
        )
    }

    //ฟังก์ชันนี้เรียกใช้ props ชื่อ onToggle จาก src/pages/User.js เพื่อปิด Modal
    toggle = () => {
        this.props.onToggle()
    }

    //ฟังก์ชันส่งการค่าการ submit โดยส่งให้ฟังก์ชันชื่อ onSubmit ที่ได้จาก props
    onSubmit = (values) => {
        this.props.onSubmit(values);
    }
}

//validate ข้อมูลก่อน submit
function validate(values) {
    const errors = {};
    if (!values.name) {
        errors.name = 'จำเป็นต้องกรอกชื่อ-สกุล';
    }

    if (!values.username) {
        errors.username = 'จำเป็นต้องกรอก Username !';
    } else if (values.username.length < 3) {
        errors.username = 'Username ต้องมากกว่า 3 ตัวอักษร !';
    }

    return errors;
}

//เรียกใช้ redux-form โดยให้มีการเรียกใช้การ validate ด้วย
const form = reduxForm({
    form: 'GrowthRateForm',
    validate
})

//สังเกตุว่าไม่มีการใช้ connect เลยเพราะเราไม่ได้เป็นตัวจัดการ data โดยตรง
//แต่ส่งสิ่งต่างผ่าน props ที่ได้จาก src/pages/User.js
export default form(GrowthRateForm)