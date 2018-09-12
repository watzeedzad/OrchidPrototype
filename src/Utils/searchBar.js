import React, { Component } from "react";
import PropTypes from "prop-types";

class SearchBar extends Component {
    //รับค่า props และกำหนด state ผ่าน  constructor เป็นอีกรูปแบบหนึ่ง
    constructor(props) {
        super(props);
        this.state = { term: "" }
    }

    //รูปแบบการกำหนด PropTypes เพื่อเช็ค props ที่ส่งเข้ามา
    static propTypes = {
        onSearchTermChange: PropTypes.func.isRequired,
        placeholder: PropTypes.string
    }

    render() {
        return (
            <input
                className="form-control"
                placeholder={this.props.placeholder}
                value={this.state.term}
                onChange={e => this.onInputChange(e.target.value)} />
        )
    }

    //ฟังก์ชันสำหรับเรียก props ที่ใช้ filter ข้อมูล
    //ดังนั้นฟังก์ชัน onSearchTermChange ที่ส่งเข้ามาต้องเป็นฟังก์ชันที่ใช้ในการ filter ข้อมูล
    //Component นี้ทำหน้าที่เพียงส่งตัวอักษรกลับไป
    onInputChange(term) {
        this.setState({ term });
        this.props.onSearchTermChange(term);
    }
}

export default SearchBar;