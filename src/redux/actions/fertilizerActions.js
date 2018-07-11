import axios from 'axios'
import config from '../../configure'

const BASE_URL = config.BASE_URL

export const saveFertilizerConfig = (values)=>{
    return (dispatch)=>{

        console.log(values);
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

export const getFertilizerTime = ({greenHouseId})=>{

    let values ={
        greenHouseId: greenHouseId
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