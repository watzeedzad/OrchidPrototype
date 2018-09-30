import React, { Component } from 'react'
import { Button, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import { getDropdownController } from '../../redux/actions/controllerActions'
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css'
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

class ControllerForm extends Component {

    constructor() {
        super();
    
        this.state = {
            checked: false,
            water:false,
            fertilizer:false,
            moisture:false,
            light:false,
            selectedOption: "", 
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleWaterChange = this.handleWaterChange.bind(this);
        this.handleFertilizerChange = this.handleFertilizerChange.bind(this);
        this.handleMoistureChange = this.handleMoistureChange.bind(this);
        this.handleLightChange = this.handleLightChange.bind(this);
    }

    handleChange() {
        this.setState({
          checked: !this.state.checked
        })
    }

    handleWaterChange() {
        this.setState({
            water: !this.state.water
        })
    }

    handleFertilizerChange() {
        this.setState({
            fertilizer: !this.state.fertilizer
        })
    }

    handleMoistureChange() {
        this.setState({
            moisture: !this.state.moisture
        })
    }

    handleLightChange() {
        this.setState({
            light: !this.state.light
        })
    }


    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการกำหนด value ให้กับ textbox และ control ต่างๆ
        if(!this.props.data._id){
            this.props.dispatch(getDropdownController({ farmId: 123456789 }))
        }
        this.handleInitialize()
        
    }

    //กำหนดค่า value ให้กับ textbox หรือ control ต่างๆ ในฟอร์ม
    //ถ้าเป็น HTML ธรรมดาก็จะกำหนดเป็น value="xxx" แต่สำหรับ redux-form
    //ต้องใช้ initialize ถ้าเป็น redux-form v.6 ต้องประกาศใช้ initialize แต่ v.7 เรียกใช้ได้เลย
    handleInitialize() {
        let initData = {
            //"mac_address": "0",
            "farmId": this.props.data.farmId,
            "greenHouseId": this.props.data.greenHouseId,
            "projectId": this.props.data.projectId,
            "name": '',
            "isHaveRelay": false,
            "water": false,
            "fertilizer": false,
            "moisture": false,
            "light": false,
            "mac_address": null
        };

        if (this.props.data._id) {
            let data = this.props.data
            this.setState({checked: data.isHaveRelay,water:data.relayType.water,fertilizer:data.relayType.fertilizer,moisture:data.relayType.moisture,light:data.relayType.light})
            // data.isHaveRelay = data.isHaveRelay==true||data.isHaveRelay=='0'?'0':'1'
            // data.relayType.water = data.relayType.water==true||data.relayType.water=='0'?'0':'1'
            // data.relayType.moisture = data.relayType.moisture==true||data.relayType.moisture=='0'?'0':'1'
            // data.relayType.fertilizer = data.relayType.fertilizer==true||data.relayType.fertilizer=='0'?'0':'1'
            
            initData = {
                "farmId": data.farmId,
                "greenHouseId": data.greenHouseId,
                "projectId": data.projectId,
                "name": data.name,
                "isHaveRelay": data.isHaveRelay,
                "water": data.relayType.water,
                "fertilizer": data.relayType.fertilizer,
                "moisture": data.relayType.moisture,
                "light": data.relayType.light,
                "mac_address": data.mac_address
            }
        }
        this.props.initialize(initData);
    }

    render() {
        //redux-form จะมี props ที่ชื่อ handleSubmit เพื่อใช้ submit ค่า
        const { classes, handleSubmit, dropdownController } = this.props

        if (!this.props.data._id && dropdownController.isLoading) {
            return <div>Loading...</div>
        }
        
        const relayType = this.state.checked
            ?  <div className="form-group row">
                        <label className="col-sm-4 col-form-label">ประเภทของรีเลย์</label>
                        <div className="col-sm-8">
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field
                                        className="form-check-input"
                                        name="water"
                                        component="input"
                                        type="checkbox"
                                        value='1'
                                        checked={this.state.water}
                                        onChange={this.handleWaterChange}
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
                                        checked={this.state.fertilizer}
                                        onChange={this.handleFertilizerChange}
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
                                        checked={this.state.moisture}
                                        onChange={this.handleMoistureChange}
                                    />{' '}ปั๊มความชื้น
                                    </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field
                                        className="form-check-input"
                                        name="light"
                                        component="input"
                                        type="checkbox"
                                        value='1'
                                        checked={this.state.light}
                                        onChange={this.handleLightChange}
                                    />{' '}หลอดไฟ
                                    </label>
                            </div>
                        </div>
                    </div>
                : null

        let options = [];
        if(dropdownController.data == null || dropdownController.data.errorMessage){
            options = [{ value: '', mac: 'ไม่มีคอนโทรลเลอร์ในระบบ' }]
        }else{
            options.push({value: '', mac: 'กรุณาเลือกคอนโทรลเลอร์'})
            for (let index = 0; index < dropdownController.data.length; index++) {
                const element = {value:dropdownController.data[index].mac_address , mac:dropdownController.data[index].mac_address};
                options.push(element)
            }
        }
        
        const renderDropdownList = ({ input, data, valueField, textField }) =>
            <DropdownList {...input}
            data={data}
            valueField={valueField}
            textField={textField}
            onChange={input.onChange} />

        const mac_address = this.props.data._id==null
            ?   <div className="form-group row">
                    <label className="col-sm-12 col-form-label">Mac Address</label>
                    <div className="col-sm-12">
                        <Field 
                            name="mac_address"
                            component={renderDropdownList}
                            data={options}
                            valueField="value"
                            textField="mac"
                        />
                    </div>
                </div>
            :   <div>
                    <FormControl margin="normal" required fullWidth>
                    <Field name="mac_address" component={MaterialRenderTextField} type="text" label="Mac Address" disabled/>
                    </FormControl> 
                </div> 
        return (
            <div>
                <form className={classes.form}>
                <ModalBody>
                    {mac_address}
                    <FormControl margin="normal" required fullWidth>
                        <Field name="name" component={MaterialRenderTextField} type="text" label="ชื่อ" autoFocus />
                    </FormControl>
                    <div className="form-group row">
                        <label className="col-sm-4 col-form-label">ประเภทคอนโทรลเลอร์</label>
                        <div className="col-sm-8">
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field
                                        className="form-check-input"
                                        name="isHaveRelay"
                                        component="input"
                                        type="radio"
                                        value="0"
                                        checked={this.state.checked}
                                        onChange={this.handleChange}
                                    />{' '}
                                    มีรีเลย์
                                    </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <Field
                                        className="form-check-input"
                                        name="isHaveRelay"
                                        component="input"
                                        type="radio"
                                        value="1"
                                        checked={ !this.state.checked } 
                                        onChange={ this.handleChange }
                                    />{' '}ไม่มีรีเลย์
                                    </label>
                            </div>
                        </div>
                    </div>
                   {relayType}
                </ModalBody>
                
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>ยกเลิก</Button>
                </ModalFooter>
                </form>
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
    // else if(values.mac_address == ""){
    //     errors.mac_address = 'จำเป็นต้องเลือกคอนโทรลเลอร์';
    // }else if(values.isHaveRelay == "0" && values.water == "1" && values.fertilizer == "1" && values.moisture =="1"){
    //     errors.isHaveRelay = 'จำเป็นต้องเลือกประเภทของปั๊มที่มี'
    // }

    return errors;
}

//เรียกใช้ redux-form โดยให้มีการเรียกใช้การ validate ด้วย
const form = reduxForm({
    form: 'ControllerForm',
    validate
})

function mapStateToProps(state) {
    return {
        dropdownController: state.controllerReducers.dropdownController,
    }
  }

export default withStyles(styles)(connect(mapStateToProps)(form(ControllerForm)))