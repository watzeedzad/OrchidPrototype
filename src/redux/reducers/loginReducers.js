
export default (state = initialState, action) => {
    switch (action.type) {

        case 'LOGIN_SUCCESS':
            return { ...state, authenticated: true, data: action.payload }
        case 'LOGIN_REJECTED':
            return { ...state, error: action.payload }
        default:
            return state
    }
}