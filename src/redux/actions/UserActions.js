import axios from 'axios'
import config from '../../configure'

//ดึงเอา url ที่ใช้ fetch data มาเก็บไว้ใน BASE_URL
const BASE_URL = config.BASE_URL

//ฟังก์ชันดึงข้อมูลผู้ใช้ทุกรายการโดยจะส่ง query ชื่อ term เข้าไปด้วยเพื่อนำไป filter
//สำหรับ es6 เราสามารถกำหนดค่า default ของ parameter ได้ด้วยครับ
export const loadUsers = ({farmId}) => {

    let values = {
        farmId: farmId
    }

    return (dispatch) => {
        //ก่อนดึงข้อมูลสั่ง dispatch ให้ reducer รู้ว่าก่อนเพื่อจะแสดง loading
        dispatch({ type: 'LOAD_USERS_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/user/showUser`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาก็สั่ง dispatch ให้ reducer รู้พร้อมส่ง payload
            //เนื่องจากเราใช้ axios แทน fetch ดังนั้นข้อมูลที่ส่งมาจะอยู่ใน object ชื่อ data
            //ที่มี Array อยู่ข้างใน ดังนั้นนำไป data.map ได้เลยครับ
            dispatch({ type: 'LOAD_USERS_SUCCESS', payload: results.data })
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'LOAD_USERS_REJECTED', payload: err.message })
        })
    }
}

export const searchUsers = ({farmId,term}) => {

    let values = {
        farmId: farmId,
        term: term
    }

    return (dispatch) => {
        //ก่อนดึงข้อมูลสั่ง dispatch ให้ reducer รู้ว่าก่อนเพื่อจะแสดง loading
        dispatch({ type: 'LOAD_USERS_PENDING' })
        return axios({
            method: 'post',
            url: `${BASE_URL}/user/searchUser`,
            data: values,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            //headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาก็สั่ง dispatch ให้ reducer รู้พร้อมส่ง payload
            //เนื่องจากเราใช้ axios แทน fetch ดังนั้นข้อมูลที่ส่งมาจะอยู่ใน object ชื่อ data
            //ที่มี Array อยู่ข้างใน ดังนั้นนำไป data.map ได้เลยครับ
            dispatch({ type: 'LOAD_USERS_SUCCESS', payload: results.data })
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'LOAD_USERS_REJECTED', payload: err.message })
        })
    }
}

//ฟังก์ชันบันทึกข้อมูลผู้ใช้ 
export const addUser = (values) => {

    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        return axios({
            method:'post',
            url:`${BASE_URL}/user/addUser`,
            data: values,
            headers:{'Content-type': 'application/json'},
            withCredentials: true
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า username ซ้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            if (results.data.errorMessage) {
                dispatch({ type: 'SAVE_USER_REJECTED', payload: results.data.errorMessage })
            } else {
                dispatch({ type: 'SAVE_USER_SUCCESS' })
            }
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'SAVE_USER_REJECTED', payload: err.message })
        })
    }
}

//ฟังก์ชั่นแก้ไขข้อมูลผู้ใช้
export const editUser = (values) => {

    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        return axios({
            method:'post',
            url:`${BASE_URL}/user/editUser`,
            data: values,
            headers:{'Content-type': 'application/json'},
            withCredentials: true
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า username ซ้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            if (results.data.errorMessage) {
                dispatch({ type: 'SAVE_USER_REJECTED', payload: results.data.errorMessage })
            } else {
                dispatch({ type: 'SAVE_USER_SUCCESS' })
            }
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'SAVE_USER_REJECTED', payload: err.message })
        })
    }
}

//ฟังก์ชันลบข้อมูลผู้ใช้ตาม id ที่ส่งเข้ามา
export const deleteUser = (value) => {
    return (dispatch) => {
        return axios({
            method:'post',
            url:`${BASE_URL}/user/deleteUser`,
            data: value,
            headers:{'Content-type': 'application/json'},
            withCredentials: true
        }).then(results => {
            //ลบข้อมูลสำเร็จ
            dispatch({ type: 'DELETE_USER_SUCCESS' })
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'DELETE_USER_REJECTED', payload: err.message })
        })
    }
}

//ฟังก์ชันสำหรับ reset ค่า status เพื่อล้างข้อความ error ที่ค้างอยู่
export const resetStatus = () => {
    return (dispatch) => {
        dispatch({ type: 'SAVE_USER_SUCCESS' })
    }
}