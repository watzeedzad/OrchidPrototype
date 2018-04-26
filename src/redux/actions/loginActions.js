import axios from 'axios'
import config from '../../configure'

//get ค่า url จากไฟล์ config
const BASE_URL = config.BASE_URL


export const login = (values) => {
    let _method = 'post'

    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        return axios({
            method: _method,
            url: `${BASE_URL}/temperatureControl/showTemperature`,
            data: values,
            headers: { 'Content-Type': 'application/json' }
            //headers: { authorization: localStorage.getItem('token') }
        }).then(result => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            dispatch({ type: 'LOGIN_SUCCESS', payload: result.data })           
        }).catch(err => {
            //กรณี error         
            dispatch({ type: 'LOGIN_REJECTED', payload: err.message })
        })
    }
}