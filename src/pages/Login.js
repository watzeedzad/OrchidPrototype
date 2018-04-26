import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { browserHistory } from 'react-router'
import { login } from '../redux/actions/loginActions'
import renderField from '../Utils/renderField'
import { Button } from 'reactstrap';


class Login extends Component {

    render() {
        const { handleSubmit } = this.props

        return (
            <div>
                <table>
                    <tr>
                        <form>
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
        this.props.dispatch(login(values)).then(() => {
            browserHistory.push('/weatherControl')
        })
    }
}




function validate(values) {
    const errors = {};
    if (values.username === "") {
        errors.username = 'กรุณากรอก username';
    }
    if (values.password === "") {
        errors.password = 'กรุณากรอก password';
    }
    return errors;
}

const form = reduxForm({
    form: 'login',
    validate
})

export default form(Login);