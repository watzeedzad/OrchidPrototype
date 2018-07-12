const initialState = {
    fertilizerConfig: {data: null,isLoading: true,isRejected: false},
    fertilizerTimeList: {data: null,isLoading: true,isRejected: false},
    manualFertilizer: { data: null, isLoading: true, isRejected: false }
}

export default (state = initialState,action)=>{
    switch(action.type){

        case 'LOAD_FERTILIZERCONFIG_PENDING':
            return {...state, fertilizerTimeList:{data:null,isLoading:true,isRejected:false}}
        case 'LOAD_FERTILIZERCONFIG_SUCCESS':
            return {...state, fertilizerTimeList:{data: action.payload ,isLoading:false,isRejected:false}}
        case 'LOAD_FERTILIZERCONFIG_REJECTED':
            return {...state, fertilizerTimeList:{data: action.payload ,isLoading:true,isRejected:true}}
        
        case 'SAVE_FERILIZERCONFIG_SUCCESS' :
            return {...state, fertilizerConfig: {data: action.payload, isLoading:false ,isRejected:false}}
        case 'SAVE_FERILIZERCONFIG_REJECTED' :
            return {...state, fertilizerConfig: {data: action.payload, isLoading:false ,isRejected:true}}
        
        case 'SAVE_MANUALWATERING_SUCCESS':
            return { ...state, manualFertilizer: { data: action.payload, isLoading: false, isRejected: false } }
        case 'SAVE_MANUALWATERING_REJECTED':
            return { ...state, manualFertilizer: { data: action.payload, isLoading: false, isRejected: true } }

        default:
            return state
    }
}
  