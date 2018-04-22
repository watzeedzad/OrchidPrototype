import axios from 'axios'

export const saveConfig = (values) => {
    let _method = 'post'

    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        return axios({
            method: _method,
            url: `http://localhost:3000/configTemperature}`,
            data: values,
            headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            dispatch({ type: 'SAVE_WEATHERCONFIG__SUCCESS' })           
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'SAVE_WEATHERCONFIG_REJECTED', payload: err.message })
        })
    }
}