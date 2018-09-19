import axios from 'axios'
import config from '../../configure'

//ดึงเอา url ที่ใช้ fetch data มาเก็บไว้ใน BASE_URL
const BASE_URL = config.BASE_URL

export const addGrowthRate = (values) => {

    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        return axios({
            method:'post',
            url:`${BASE_URL}/monitoringAndAnalyze/addGrowthRate`,
            data: values,
            headers:{'Content-type': 'application/json'},
            withCredentials: true
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า username ซ้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            if (results.data.errorMessage) {
                dispatch({ type: 'SAVE_GROWTHRATE_REJECTED', payload: results.data.errorMessage })
            } else {
                dispatch({ type: 'SAVE_GROWTHRATE_SUCCESS' })
            }
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'SAVE_GROWTHRATE_REJECTED', payload: err.message })
        })
    }
}

export const resetStatus = () => {
    return (dispatch) => {
        dispatch({ type: 'SAVE_USER_SUCCESS' })
    }
}