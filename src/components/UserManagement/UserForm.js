import React, { Component } from 'react'
import { Button, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import FormControl from '@material-ui/core/FormControl';
import withStyles from '@material-ui/core/styles/withStyles';
import MaterialRenderTextField from '../../Utils/MaterialRenderTextField';

const styles = theme => ({
    layout: {
      width: 'auto',
      display: 'block', // Fix IE11 issue.
      marginTop: theme.spacing.unit * 8,
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(250 + theme.spacing.unit * 3 * 2)]: {
        width: 250,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    form: {
      width: '100%', // Fix IE11 issue.
      marginTop: theme.spacing.unit,
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
    },

});

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
            "role": 'เจ้าของฟาร์ม',
            "lastname": '',
            "username": '',
            "password": '',
            "repassword": '',
        };

        //ตรวจสอบก่อนว่ามี data._id หรือไม่
        //ถ้าไม่มีแสดงว่าเป็นการสร้างรายการใหม่
        //ถ้ามีแสดงว่ามีการ get ข้อมูลผู้ใช้งานจึงเป็นการปรับปรุง
        if (this.props.data._id) {
            this.setState({role:this.props.data.role})
            initData = this.props.data
            initData.password = ''
            //user_type ที่รับมาเป็น init แต่value ต้องแปลงเป็น string ก่อน
        }
        this.props.initialize(initData);
    }


    render() {
        //redux-form จะมี props ที่ชื่อ handleSubmit เพื่อใช้ submit ค่า
        const { classes, handleSubmit, userSave } = this.props
        const passwordField = this.props.data._id 
            ? null
            : <div>
                <FormControl margin="normal" required fullWidth>
                    <Field name="password" component={MaterialRenderTextField} type="password" label="รหัสผ่าน" />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <Field name="repassword" component={MaterialRenderTextField} type="password" label="ยืนยันรหัสผ่าน" />
                </FormControl>
              </div>

        return (
            <div>
                <ModalBody>
                    {/* ตรวจสอบว่ามี err หรือไม่ */}
                    {userSave.isRejected && <div className="alert alert-danger">{userSave.data}</div>}

                    {/* รูปแบบการแสดงผลจัดตาม Bootstrap 4 */}
                    <form className={classes.form}>
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
                        <div className="col-sm-9">
                            <FormControl margin="normal" required fullWidth>
                            <Field name="firstname" component={MaterialRenderTextField} type="text" label="ชื่อ" />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                            <Field name="lastname" component={MaterialRenderTextField} type="text" label="นามสกุล" />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                            {this.props.data._id
                                ? <Field name="username" component={MaterialRenderTextField} type="text" label="ไอดีผู้ใช้"  disabled/>
                                : <Field name="username" component={MaterialRenderTextField} type="text" label="ไอดีผู้ใช้" />
                            }
                            </FormControl>
                            {passwordField}
                        </div>
                    </form>
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
    if (!values.firstname) {
        errors.firstname = 'จำเป็นต้องกรอกชื่อ';
    }
    if (!values.lastname) {
        errors.lastname = 'จำเป็นต้องกรอกนามสกุล';
    }
    if (!values.username) {
        errors.username = 'จำเป็นต้องกรอกไอดีผู้ใช้';
    } else if (values.username.length < 3) {
        errors.username = 'Username ต้องมากกว่า 3 ตัวอักษร !';
    }
    if (!values.password) {
        errors.password = 'จำเป็นต้องกรอกรหัสผ่าน';
    }
    if (!values.repassword) {
        errors.repassword = 'จำเป็นต้องกรอกยืนยันรหัสผ่าน';
    }else if (values.repassword != values.password) {
        errors.repassword = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
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
export default withStyles(styles)(form(UserForm))