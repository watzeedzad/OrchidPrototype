import React, { Component } from 'react'
import { Button, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import renderField from '../../Utils/renderField'

class UserForm extends Component {

    constructor() {
        super();
    
        this.state = {
            role: 'เจ้าของฟาร์ม',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        if(this.state.role === 'เจ้าของฟาร์ม'){
            this.setState({
                role: 'พนักงาน'
            })
        }else{
            this.setState({
                role: 'เจ้าของฟาร์ม'
            })
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
            "farmId": this.props.data.farmId,
            "firstname": '',
            "role": '',
            "lastname": '',
            "username": '',
            "password": ''
        };

        //ตรวจสอบก่อนว่ามี data._id หรือไม่
        //ถ้าไม่มีแสดงว่าเป็นการสร้างรายการใหม่
        //ถ้ามีแสดงว่ามีการ get ข้อมูลผู้ใช้งานจึงเป็นการปรับปรุง
        if (this.props.data._id) {
            this.setState({role:this.props.data.role})
            initData = this.props.data
            //user_type ที่รับมาเป็น init แต่value ต้องแปลงเป็น string ก่อน
        }
        this.props.initialize(initData);
    }

    render() {
        //redux-form จะมี props ที่ชื่อ handleSubmit เพื่อใช้ submit ค่า
        const { handleSubmit, userSave } = this.props
        return (
            <div>
                <ModalBody>
                    {/* ตรวจสอบว่ามี err หรือไม่ */}
                    {userSave.isRejected && <div className="alert alert-danger">{userSave.data}</div>}

                    {/* รูปแบบการแสดงผลจัดตาม Bootstrap 4 */}
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">ประเภทผู้ใช้</label>
                        <div className="col-sm-9">
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field
                                        className="form-check-input"
                                        name="role"
                                        component="input"
                                        type="radio"
                                        value='เจ้าของฟาร์ม'
                                        checked={this.state.role === 'เจ้าของฟาร์ม'}
                                        onChange={this.handleChange}
                                    />{' '}
                                    เจ้าของฟาร์ม
                                    </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field
                                        className="form-check-input"
                                        name="role"
                                        component="input"
                                        type="radio"
                                        value="พนักงาน"
                                        checked={this.state.role === 'พนักงาน'}
                                        onChange={this.handleChange}
                                    />{' '}พนักงาน
                                    </label>
                            </div>
                        </div>
                    </div>
                    <Field name="firstname" component={renderField} type="text" label="ชื่อ" autoFocus />
                    <Field name="lastname" component={renderField} type="text" label="สกุล" />
                    <Field name="username" component={renderField} type="text" label="Username" />
                    <Field name="password" component={renderField} type="password" label="Password" />
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
    form: 'UserForm',
    validate
})

//สังเกตุว่าไม่มีการใช้ connect เลยเพราะเราไม่ได้เป็นตัวจัดการ data โดยตรง
//แต่ส่งสิ่งต่างผ่าน props ที่ได้จาก src/pages/User.js
export default form(UserForm)