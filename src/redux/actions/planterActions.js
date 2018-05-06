import axios from 'axios'
import config from '../../configure'

//get ค่า url จากไฟล์ config
const BASE_URL = config.BASE_URL

export const saveMoistureConfig = (values) => {
    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        return axios({
            method: 'post',
            url: `${BASE_URL}/planterAnalyze/configSoilMoisture`,
            data: values,
            headers: { 'Content-Type': 'application/json' }
            //headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            console.log('2')
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา         
            dispatch({ type: 'SAVE_MOISTURECONFIG_SUCCESS' })
        }).catch(err => {
            console.log('3')
            //กรณี error
            dispatch({ type: 'SAVE_MOISTURECONFIG_REJECTED', payload: err.message })
        })
    }
}

export const getMoisture = ({greenHouseId}) => {

    let values = {
        greenHouseId: greenHouseId
    }
    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        dispatch({ type: 'LOAD_MOISTURE_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/planterAnalyze/showSoilMoisture`,
            data: values,
            headers: { 'Content-Type': 'application/json' }
            //headers: { authorization: localStorage.getItem('token') }
        }).then(result => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            dispatch({ type: 'LOAD_MOISTURE_SUCCESS', payload: result.data })           
        }).catch(err => {
            //กรณี error         
            dispatch({ type: 'LOAD_MOISTURE_REJECTED', payload: err.message })
        })
    }
}

export const getAllFertility = ({greenHouseId}) => {

    let values = {
        greenHouseId: greenHouseId
    }

    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        dispatch({ type: 'LOAD_ALLFERTILITY_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/planterAnalyze/showAllFertility`,
            data: values,
            headers: { 'Content-Type': 'application/json' }
            //headers: { authorization: localStorage.getItem('token') }
        }).then(result => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            console.log(result)
            dispatch({ type: 'LOAD_ALLFERTILITY_SUCCESS', payload: result.data })           
        }).catch(err => {
            //กรณี error         
            dispatch({ type: 'LOAD_ALLFERTILITY_REJECTED', payload: err.message })
        })
    }
}
