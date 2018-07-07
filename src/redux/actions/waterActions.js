import axios from 'axios'
import config from '../../configure'
import { browserHistory } from 'react-router'

//get ค่า url จากไฟล์ config
const BASE_URL = config.BASE_URL

export const saveWaterConfig = (values) => {
    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        return axios({
            method: 'post',
            url: `${BASE_URL}/waterControl/wateringConfig`,
            data: values,
            headers: { 'Content-Type': 'application/json' }
            //headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา         
            dispatch({ type: 'SAVE_WATERCONFIG_SUCCESS' , payload: results.data})
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'SAVE_WATERCONFIG_REJECTED', payload: err.message })
        })
    }
}