//ก�ำหนดค่าเริ่มต้นให้ state เช่น เช็คว่าข้อมูลที่ดึงมา error หรือไม่เราก็จะเช็คจาก isRejected
//ซึ่งถ้าเราไม่ก�ำหนด state เริ่มต้นก็จะไม่มี object ชื่อ isRejected ให้เรียกใช้งาน
const initialState = {
    gController: { data: null, isLoading: true, isRejected: false },
    deleteController: { data: null, isLoading: true, isRejected: false },
    editController: { data: null, isLoading: true, isRejected: false },
    dropdownController: { data: null, isLoading: true, isRejected: false },

}
export default (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_GCONTROLLER_PENDING':
            return { ...state, gController: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_GCONTROLLER_SUCCESS':
            return { ...state, gController: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_GCONTROLLER_REJECTED':
            return { ...state, gController: { data: action.payload, isLoading: false, isRejected: true } }

        case 'DELETE_CONTROLLER_SUCCESS' :
            return {...state, deleteController: {data: action.payload, isLoading:false ,isRejected:false}}
        case 'DELETE_CONTROLLER_REJECTED' :
            return {...state, deleteController: {data: action.payload, isLoading:false ,isRejected:true}}

        case 'EDIT_CONTROLLER_SUCCESS' :
            return {...state, editController: {data: action.payload, isLoading:false ,isRejected:false}}
        case 'EDIT_CONTROLLER_REJECTED' :
            return {...state, editController: {data: action.payload, isLoading:false ,isRejected:true}}

        case 'LOAD_DROPDOWNCONTROLLER_PENDING':
            return { ...state, dropdownController: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_DROPDOWNCONTROLLER_SUCCESS':
            return { ...state, dropdownController: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_DROPDOWNCONTROLLER_REJECTED':
            return { ...state, dropdownController: { data: action.payload, isLoading: false, isRejected: true } }

        default:
            return state
    }
}