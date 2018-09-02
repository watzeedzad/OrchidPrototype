import React, { Component } from 'react'
import { Button, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import { getDropdownController } from '../../redux/actions/controllerActions'
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css'
import renderField from '../../Utils/renderField'

class ControllerForm extends Component {

    constructor() {
        super();
    
        this.state = {
            checked: false,
            water:false,
            fertilizer:false,
            moisture:false,
            selectedOption: "", 
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleWaterChange = this.handleWaterChange.bind(this);
        this.handleFertilizerChange = this.handleFertilizerChange.bind(this);
        this.handleMoistureChange = this.handleMoistureChange.bind(this);
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
            "isHavePump": false,
            "water": false,
            "fertilizer": false,
            "moisture": false,
            "mac_address": null
        };

        if (this.props.data._id) {
            let data = this.props.data
            this.setState({checked: data.isHavePump,water:data.pumpType.water,fertilizer:data.pumpType.fertilizer,moisture:data.pumpType.moisture})
            // data.isHavePump = data.isHavePump==true||data.isHavePump=='0'?'0':'1'
            // data.pumpType.water = data.pumpType.water==true||data.pumpType.water=='0'?'0':'1'
            // data.pumpType.moisture = data.pumpType.moisture==true||data.pumpType.moisture=='0'?'0':'1'
            // data.pumpType.fertilizer = data.pumpType.fertilizer==true||data.pumpType.fertilizer=='0'?'0':'1'
            
            initData = {
                "farmId": data.farmId,
                "greenHouseId": data.greenHouseId,
                "projectId": data.projectId,
                "name": data.name,
                "isHavePump": data.isHavePump,
                "water": data.pumpType.water,
                "fertilizer": data.pumpType.fertilizer,
                "moisture": data.pumpType.moisture,
                "mac_address": data.mac_address
            }
        }
        this.props.initialize(initData);
    }

    render() {
        //redux-form จะมี props ที่ชื่อ handleSubmit เพื่อใช้ submit ค่า
        const { handleSubmit,dropdownController } = this.props
        console.log(dropdownController.data)

        if (!this.props.data._id && dropdownController.isLoading) {
            return <div>Loading...</div>
        }
        
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
                    <label className="col-sm-3 col-form-label">Mac Address</label>
                    <div className="col-sm-9">
                        <Field 
                            name="mac_address"
                            component={renderDropdownList}
                            data={options}
                            valueField="value"
                            textField="mac"
                        />
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
                    <Field name="farmId" component={renderField} type="hidden" />
                    <Field name="greenHouseId" component={renderField} type="hidden" />
                    <Field name="projectId" component={renderField} type="hidden" />
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
    // else if(values.mac_address == ""){
    //     errors.mac_address = 'จำเป็นต้องเลือกคอนโทรลเลอร์';
    // }else if(values.isHavePump == "0" && values.water == "1" && values.fertilizer == "1" && values.moisture =="1"){
    //     errors.isHavePump = 'จำเป็นต้องเลือกประเภทของปั๊มที่มี'
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

export default connect(mapStateToProps)(form(ControllerForm))