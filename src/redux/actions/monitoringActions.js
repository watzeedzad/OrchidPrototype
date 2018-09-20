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

export const loadFarmCSV = () => {
    let values = {}

    return (dispatch) => {
        //ก่อนดึงข้อมูลสั่ง dispatch ให้ reducer รู้ว่าก่อนเพื่อจะแสดง loading
        dispatch({ type: 'LOAD_FARMCSV_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/monitoringAndAnalyze/loadGrowthRateCSV`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาก็สั่ง dispatch ให้ reducer รู้พร้อมส่ง payload
            //เนื่องจากเราใช้ axios แทน fetch ดังนั้นข้อมูลที่ส่งมาจะอยู่ใน object ชื่อ data
            //ที่มี Array อยู่ข้างใน ดังนั้นนำไป data.map ได้เลยครับ
            dispatch({ type: 'LOAD_FARMCSV_SUCCESS', payload: results.data })
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'LOAD_FARMCSV_REJECTED', payload: err.message })
        })
    }
}

export const loadGreenHouseCSV = ({greenHouseId}) => {

    let values = {
        greenHouseId: greenHouseId
    }

    return (dispatch) => {
        //ก่อนดึงข้อมูลสั่ง dispatch ให้ reducer รู้ว่าก่อนเพื่อจะแสดง loading
        dispatch({ type: 'LOAD_GREENHOUSECSV_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/monitoringAndAnalyze/loadGrowthRateCSV`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาก็สั่ง dispatch ให้ reducer รู้พร้อมส่ง payload
            //เนื่องจากเราใช้ axios แทน fetch ดังนั้นข้อมูลที่ส่งมาจะอยู่ใน object ชื่อ data
            //ที่มี Array อยู่ข้างใน ดังนั้นนำไป data.map ได้เลยครับ
            dispatch({ type: 'LOAD_GREENHOUSECSV_SUCCESS', payload: results.data })
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'LOAD_GREENHOUSECSV_REJECTED', payload: err.message })
        })
    }
}

export const loadProjectCSV = ({greenHouseId,projectId}) => {

    let values = {
        greenHouseId: greenHouseId,
        projectId: projectId
    }

    return (dispatch) => {
        //ก่อนดึงข้อมูลสั่ง dispatch ให้ reducer รู้ว่าก่อนเพื่อจะแสดง loading
        dispatch({ type: 'LOAD_PROJECTCSV_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/monitoringAndAnalyze/loadGrowthRateCSV`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาก็สั่ง dispatch ให้ reducer รู้พร้อมส่ง payload
            //เนื่องจากเราใช้ axios แทน fetch ดังนั้นข้อมูลที่ส่งมาจะอยู่ใน object ชื่อ data
            //ที่มี Array อยู่ข้างใน ดังนั้นนำไป data.map ได้เลยครับ
            dispatch({ type: 'LOAD_PROJECTCSV_SUCCESS', payload: results.data })
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'LOAD_PROJECTCSV_REJECTED', payload: err.message })
        })
    }
}

export const loadGrowthRate = ({greenHouseId,projectId}) => {
    let values = {
        greenHouseId:greenHouseId,
        projectId:projectId
    }
    
    return (dispatch) => {
        //ก่อนดึงข้อมูลสั่ง dispatch ให้ reducer รู้ว่าก่อนเพื่อจะแสดง loading
        dispatch({ type: 'LOAD_GROWTHRATE_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/monitoringAndAnalyze/loadGrowthRateCSV`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาก็สั่ง dispatch ให้ reducer รู้พร้อมส่ง payload
            //เนื่องจากเราใช้ axios แทน fetch ดังนั้นข้อมูลที่ส่งมาจะอยู่ใน object ชื่อ data
            //ที่มี Array อยู่ข้างใน ดังนั้นนำไป data.map ได้เลยครับ
            dispatch({ type: 'LOAD_GROWTHRATE_SUCCESS', payload: results.data })
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'LOAD_GROWTHRATE_REJECTED', payload: err.message })
        })
    }
}

export const resetStatus = () => {
    return (dispatch) => {
        dispatch({ type: 'SAVE_USER_SUCCESS' })
    }
}