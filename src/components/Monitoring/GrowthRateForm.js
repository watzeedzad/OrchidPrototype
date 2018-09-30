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
        const { classes, handleSubmit, growthRateSave } = this.props
        return (
            <div>
                <ModalBody>
                    <div className="col-sm-9">
                    {/* ตรวจสอบว่ามี err หรือไม่ */}
                        {growthRateSave.isRejected && <div className="alert alert-danger">{growthRateSave.data}</div>}
                        <form className={classes.form}>
                            <FormControl margin="normal" required fullWidth>
                            <Field name="timeStamp"  component={MaterialRenderTextField} type='text' label="วันที่" disabled/>
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                            <Field name="trunkDiameter" component={MaterialRenderTextField} type="number" label="เส้นผ่านศูนย์กลางลำต้น (ซม.)" />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                            <Field name="leafWidth" component={MaterialRenderTextField} type="number" label="ความกว้างใบ (ซม.)" />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                            <Field name="totalLeaf" component={MaterialRenderTextField} type="number" label="จำนวนใบ" />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                            <Field name="height" component={MaterialRenderTextField} type="number" label="ความสูง (ซม.)" />
                            </FormControl>
                        </form>
                    </div>

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
export default withStyles(styles)(form(GrowthRateForm))