import axios from 'axios'
import config from '../../configure'

const BASE_URL = config.BASE_URL

export const saveFertilizerConfig = (values)=>{
    return (dispatch)=>{
        return axios({
            method:'post',
            url:`${BASE_URL}/fertilizerControl/fertilizerConfig`,
            data: values,
            headers:{'Content-type': 'application/json'}
        }).then(result=>{
            dispatch({type:'SAVE_FERTILIZER_SUCCESS' , payload: result.data});
        }).catch(err=>{
            dispatch({type:'SACE_FERTILIZER_REJECTED',payload: err.message});
        })
    }
}

export const getFertilizerTime = ({projectId})=>{

    let values ={
        projectId: projectId
    }

    return (dispatch)=>{
        dispatch({type: 'LOAD_FERTILIZERCONFIG_PENDING'});
        return axios({
            method: 'post',
            url: `${BASE_URL}/fertilizerControl//showFertilizerConfig`,
            data:values,
            headers:{'Content-Type':'application/json'}

        }).then(result =>{
            dispatch({ type:'LOAD_FERTILIZERCONFIG_SUCCESS',payload:result.data})

        }).catch(err=>{
            dispatch({type:'LOAD_FERTILIZERCONFIG_REJECTED',payload:err.message})
        })
    }

}

export const manaulFertilizer = (values) => {
    return (dispatch) => {
        //รูปแบบการใช้ axios อีกรูปแบบในการจะบุ method ที่ต้องการ
        //ต้องส่ง heder ชื่อ authorization โดยส่ง token เขาไปด้วยครับ
        return axios({
            method: 'post',
            url: `${BASE_URL}/fertilizerControl/manualFertilizer`,
            data: values,
            headers: { 'Content-Type': 'application/json' }
            //headers: { authorization: localStorage.getItem('token') }
        }).then(results => {
            //เมื่อข้อมูลส่งกลับมาต้องเช็คสถานะก่อนว่า code ซ�้ำหรือไม่
            //โดยserver จะส่ง object ที่ชื่อว่า status และ message กลับมา   
            dispatch({ type: 'SAVE_MANUALFERTILIZER_SUCCESS' , payload: results.data})
        }).catch(err => {
            //กรณี error
            dispatch({ type: 'SAVE_MANUALFERTILIZER_REJECTED', payload: err.message })
        })
    }
}