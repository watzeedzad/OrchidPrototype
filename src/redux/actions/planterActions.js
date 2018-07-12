import axios from 'axios'
import config from '../../configure'
import { browserHistory } from 'react-router'

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
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา         
            dispatch({ type: 'SAVE_MOISTURECONFIG_SUCCESS' })
        }).catch(err => {
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
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
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

export const getMoistureHistory = ({greenHouseId}) => {

    let values = {
        greenHouseId: greenHouseId
    }
    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        dispatch({ type: 'LOAD_MOISTUREHISTORY_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/planterAnalyze/showSoilMoistureHistory`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(result => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            dispatch({ type: 'LOAD_MOISTUREHISTORY_SUCCESS', payload: result.data })           
        }).catch(err => {
            //กรณี error         
            dispatch({ type: 'LOAD_MOISTUREHISTORY_REJECTED', payload: err.message })
        })
    }
}

export const saveFertilityConfig = (values) => {
    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        console.log(values)
        return axios({
            method: 'post',
            url: `${BASE_URL}/planterAnalyze/configFertility`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา         
            dispatch({ type: 'SAVE_FERTILITYCONFIG_SUCCESS' })
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'SAVE_FERTILITYCONFIG_REJECTED', payload: err.message })
        })
    }
}

export const getFertility = ({projectId}) => {

    let values = {
        projectId: projectId
    }
    
    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        dispatch({ type: 'LOAD_FERTILITY_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/planterAnalyze/showFertility`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(result => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            //browserHistory.push('/fertilityControl')
            dispatch({ type: 'LOAD_FERTILITY_SUCCESS', payload: result.data })           
        }).catch(err => {
            //กรณี error         
            dispatch({ type: 'LOAD_FERTILITY_REJECTED', payload: err.message })
        })
    }
}

export const getFertilityHistory = ({projectId}) => {

    let values = {
        projectId: projectId
    }
    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        dispatch({ type: 'LOAD_FERTILITYHISTORY_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/planterAnalyze/showFertilityHistory`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(result => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            dispatch({ type: 'LOAD_FERTILITYHISTORY_SUCCESS', payload: result.data })           
        }).catch(err => {
            //กรณี error         
            dispatch({ type: 'LOAD_FERTILITYHISTORY_REJECTED', payload: err.message })
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
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(result => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            dispatch({ type: 'LOAD_ALLFERTILITY_SUCCESS', payload: result.data })           
        }).catch(err => {
            //กรณี error         
            dispatch({ type: 'LOAD_ALLFERTILITY_REJECTED', payload: err.message })
        })
    }
}
