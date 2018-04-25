import axios from 'axios'

export const saveTempConfig = (values) => {
    let _method = 'post'
    
    if(!values.farmId){
        console.log("eiei")
    }

    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        return axios({
            method: _method,
            url: `http://127.0.0.1:3001/temperatureControl/configTemperature`,
            data: values,
            headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            console.log(results)
            dispatch({ type: 'SAVE_TEMPCONFIG_SUCCESS' })           
        }).catch(err => {
            //กรณี error
            console.log(err)
            dispatch({ type: 'SAVE_TEMPCONFIG_REJECTED', payload: err.message })
        })
    }
}

// export const getTempConfig = (farmId) => {
//     let _method = 'post'

//     return (dispatch) => {
//         //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
//         //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
//         dispatch({ type: 'LOAD_TEMPCONFIG_PENDING' })
//         return axios({
//             method: _method,
//             url: `http://127.0.0.1:3001/temperatureControl/getConfigTemperature`,
//             data: farmId,
//             headers: { 'Content-Type': 'application/json' }
//             //headers: { authorization: localStorage.getItem('token') }
//         }).then(result => {
//             //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
//             //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
//             dispatch({ type: 'LOAD_TEMPCONFIG_SUCCESS', payload: result.data })           
//         }).catch(err => {
//             //กรณี error         
//             dispatch({ type: 'LOAD_TEMPCONFIG_REJECTED', payload: err.message })
//         })
//     }
// }

export const getTemp = ({farmId,greenHouseId}) => {
    let _method = 'post'

    let values = {
        farmId: farmId,
        greenHouseId: greenHouseId
    }
    console.log(values)
    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        dispatch({ type: 'LOAD_TEMP_PENDING' })
        return axios({
            method: _method,
            url: `http://127.0.0.1:3001/temperatureControl/showTemperature`,
            data: values,
            headers: { 'Content-Type': 'application/json' }
            //headers: { authorization: localStorage.getItem('token') }
        }).then(result => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา
            dispatch({ type: 'LOAD_TEMP_SUCCESS', payload: result.data })           
        }).catch(err => {
            //กรณี error         
            dispatch({ type: 'LOAD_TEMP_REJECTED', payload: err.message })
        })
    }
}