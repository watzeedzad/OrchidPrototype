const initialState = {
    user: { data: null, isLoading: true, isRejected: false }
}
export default (state = initialState, action) => {
    switch (action.type) {

        //เก็บ state tempearture config
        case 'LOGIN_SUCCESS':
            return { ...state, user: { data: null, isLoading: false, isRejected: false } }
        case 'LOGIN_REJECTED':
            return { ...state, user: { data: action.payload, isLoading: false, isRejected: true } }
        default:
            return state
    }
}