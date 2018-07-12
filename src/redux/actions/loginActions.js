import axios from 'axios'
import config from '../../configure'
import { browserHistory } from 'react-router'
import jwtDecode from 'jwt-decode';

//get ค่า url จากไฟล์ config
const BASE_URL = config.BASE_URL


export const login = (values) => {
    let _method = 'post'

    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        return axios({
            method: _method,
            url: `${BASE_URL}/login/`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(result => {
            //สั่ง redirect ไปหน้าแรก (/)
            browserHistory.push('/weatherControl')
            dispatch({ type: 'LOGIN_SUCCESS' })
        }).catch(err => {
            //กรณี error         
            dispatch({ type: 'LOGIN_REJECTED', payload: err.message })
        })
    }
}