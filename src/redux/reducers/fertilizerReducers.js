const initialState = {
    fertilizerConfig: {
        data: null,
        isLoading: true,
        isRejected: false
    },
    fertilizerTimeList: {
        data: null,
        isLoading: true,
        isRejected: false
    }
}

export default(state = initialState,action)=>{
    switch(action.type){

        case 'LOAD_FERTILIZERCONFIG_PENDING':
            return {...state, fertilizerTimeList:{data:null,isLoading:true,isRejected:false}}
        case 'LOAD_FERTILICERCONFIG_SUCCESS':
            return {...state, fertilizerTimeList:{data: action.payload ,isLoading:false,isRejected:false}}
        case 'LOAD_FERTILICERCONFIG_REJECTED':
            return {...state, fertilizerTimeList:{data: action.payload ,isLoading:true,isRejected:true}}
        
        case 'SAVE_FERILIZERCONFIG_SUCCESS' :
            return {...state, fertilizerConfig: {data: action.payload, isLoading:false ,isRejected:false}}
        case 'SAVE_FERILIZERCONFIG_REJECTED' :
            return {...state, fertilizerConfig: {data: action.payload, isLoading:false ,isRejected:true}}
    }
}
  