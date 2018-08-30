import React, { Component } from 'react'
import { Button, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

import renderField from '../../Utils/renderField'

class ControllerForm extends Component {

    constructor() {
        super();
    
        this.state = { checked: false };
        this.handleChange = this.handleChange.bind(this);
      }
    
      handleChange() {
        this.setState({
          checked: !this.state.checked
        })
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
            "mac_address": "0",
            "name": '',
            "isHavePump": '1',
            "water": '1',
            "moisture":'1',
            "fertilizer":'1'
        };

        if (this.props.data._id) {
            let data = this.props.data
            this.setState({checked: data.isHavePump})
            data.isHavePump = data.isHavePump==true||data.isHavePump=='0'?'0':1
            data.pumpType.water = data.pumpType.water==true||data.pumpType.water=='0'?'0':1
            data.pumpType.moisture = data.pumpType.moisture==true||data.pumpType.moisture=='0'?'0':1
            data.pumpType.fertilizer = data.pumpType.fertilizer==true||data.pumpType.fertilizer=='0'?'0':1
            
            initData = data
        }
        this.props.initialize(initData);
    }

    render() {
        //redux-form จะมี props ที่ชื่อ handleSubmit เพื่อใช้ submit ค่า
        const { handleSubmit } = this.props

        const pumpType = this.state.checked
            ?  <div className="form-group row">
                        <label className="col-sm-3 col-form-label">ประเภทของปั๊ม</label>
                        <div className="col-sm-9">
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field
                                        className="form-check-input"
                                        name="water"
                                        component="input"
                                        type="checkbox"
                                        value='1'
                                    />{' '}
                                    ปั๊มน้ำ
                                    </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field
                                        className="form-check-input"
                                        name="fertilizer"
                                        component="input"
                                        type="checkbox"
                                        value='1'
                                    />{' '}ปั๊มปุ๋ย
                                    </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field
                                        className="form-check-input"
                                        name="moisture"
                                        component="input"
                                        type="checkbox"
                                        value='1'
                                    />{' '}ปั๊มความชื้น
                                    </label>
                            </div>
                        </div>
                    </div>
                : null

        const mac_address = this.props.data._id==null
            ?   <div className="form-group row">
                    <label className="col-sm-3 col-form-label">ประเภทคอนโทรลเลอร์</label>
                    <div className="col-sm-9">
                        <div className="form-check form-check-inline">
                            <select name="mac_address">
                                <option value="12:48:AF:87:FD:58">12:48:AF:87:FD:58</option>
                            </select>
                        </div>
                    </div>
                </div>
            :  <Field name="mac_address" component={renderField} type="text" label="Mac Address" readOnly/>    
        return (
            <div>
                <form>
                <ModalBody>
                    {mac_address}
                    <Field name="name" component={renderField} type="text" label="ชื่อ" autoFocus />
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">ประเภทคอนโทรลเลอร์</label>
                        <div className="col-sm-9">
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field
                                        className="form-check-input"
                                        name="isHavePump"
                                        component="input"
                                        type="radio"
                                        value="0"
                                        checked={this.state.checked}
                                        onChange={this.handleChange}
                                    />{' '}
                                    มีปั๊ม
                                    </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field
                                        className="form-check-input"
                                        name="isHavePump"
                                        component="input"
                                        type="radio"
                                        value="1"
                                        checked={ !this.state.checked } 
                                        onChange={ this.handleChange }
                                    />{' '}ไม่มีปั๊ม
                                    </label>
                            </div>
                        </div>
                    </div>
                   {pumpType}
                </ModalBody>
                </form>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>ยกเลิก</Button>
                </ModalFooter>
            </div>
        )
    }

    toggle = () => {
        this.props.onToggle()
    }

    onSubmit = (values) => {
        this.props.onSubmit(values);
    }
}

//validate ข้อมูลก่อน submit
function validate(values) {
    const errors = {};
    if (!values.name) {
        errors.name = 'จำเป็นต้องกรอกชื่อคอนโทรลเลอร์';
    }

    return errors;
}

//เรียกใช้ redux-form โดยให้มีการเรียกใช้การ validate ด้วย
const form = reduxForm({
    form: 'ControllerForm',
    validate
})

//สังเกตุว่าไม่มีการใช้ connect เลยเพราะเราไม่ได้เป็นตัวจัดการ data โดยตรง
//แต่ส่งสิ่งต่างผ่าน props ที่ได้จาก src/pages/User.js
export default form(ControllerForm)