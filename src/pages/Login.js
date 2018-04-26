import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { browserHistory } from 'react-router'
import { login } from '../redux/actions/loginActions';
import renderField from '../Utils/renderField';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';


class Login extends Component {

    render() {
        const { handleSubmit } = this.props

        return (
            <div>
                <table>
                    <tr>
                        <form>
                            {this.renderAlert()}
                            <td><Field name="username" component={renderField} type="text" label="Username" /></td>
                            <td><Field name="password" component={renderField} type="password" label="Password" /></td>
                            <td><Button color="primary" onClick={handleSubmit(this.onSubmit)}>บันทึก</Button></td>
                        </form>
                    </tr>
                </table>               
            </div>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        console.log(values)
        this.props.dispatch(login(values))
    }

    renderAlert() {
        if (this.props.errorMessage) {
            return (
                <div className="alert alert-danger">
                    <strong>Warning: </strong>{this.props.errorMessage}
                </div>
            )
        }
    }
}

function validate(values) {
    const errors = {};
    if (!values.username) {
        errors.username = 'กรุณากรอก username';
    }
    if (!values.password) {
        errors.password = 'กรุณากรอก password';
    }
    return errors;
}

const form = reduxForm({
    form: 'login',
    validate
})

function mapStateToProps(state) {
    return {
        // errorMessage: state.loginReducers.error //กรณี Signin ไม่ผ่าน
    }
}

export default connect(mapStateToProps)(form(Login));