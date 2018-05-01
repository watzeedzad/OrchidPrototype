import React from 'react';
import {Label} from 'reactstrap';

//renderField จะรับ props ต่างๆ ของ Field ที่ได้จาก redux-form
const renderField = ({ input, label ,type, textarea, autoFocus,meta: { touched, error } }) => {
    //ส�ำหรับรูปแบบ Field ที่เป็น TextArea
    const textareaType = <textarea {...input}
        placeholder={label}
        className="form-control" row="3" />;
    //ส�ำหรับรูปแบบ Field ที่เป็น TextBox
    const inputType = <input {...input}
        placeholder={label}
        type={type}
        className="form-control"
        autoFocus={autoFocus} />;
    return (
        <div class="form-group">
            <Label>{label}</Label>
            <div className="col-sm-7">
                {/* เลือกว่าจะแสดงแบบ textarea หรือ input ธรรมดา*/}
                {textarea ? textareaType : inputType}
                {/* ส่วนนี้จะแสดงข้อความ error ที่ได้จากการ validate */}
                {touched && error && <small className="text-danger"><br/>{error}</small>}
            </div>
        </div>
    )
}
export default renderField;