import axios from 'axios'
import config from '../../configure'

//get ค่า url จากไฟล์ config
const BASE_URL = config.BASE_URL

export const getGreenHouseController = ({farmId}) => {

    let values = {
        farmId: farmId
    }
    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        dispatch({ type: 'LOAD_GCONTROLLER_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/controllerManagement/showAllGreenHouseController`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(result => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            dispatch({ type: 'LOAD_GCONTROLLER_SUCCESS', payload: result.data })           
        }).catch(err => {
            //กรณี error         
            dispatch({ type: 'LOAD_GCONTROLLER_REJECTED', payload: err.message })
        })
    }
}