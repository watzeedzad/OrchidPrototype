//ก�ำหนดค่าเริ่มต้นให้ state เช่น เช็คว่าข้อมูลที่ดึงมา error หรือไม่เราก็จะเช็คจาก isRejected
//ซึ่งถ้าเราไม่ก�ำหนด state เริ่มต้นก็จะไม่มี object ชื่อ isRejected ให้เรียกใช้งาน
const initialState = {
    tempConfigSave: { data: null, isLoading: true, isRejected: false },
    tempConfig: { data: null, isLoading: true, isRejected: false },
    temp: { data: null, isLoading: true, isRejected: false }
}
export default (state = initialState, action) => {
    switch (action.type) {
        // //เก็บ state การดึงข้อมูล temperature config
        // case 'LOAD_TEMPCONFIG_PENDING':
        //     return { ...state, tempConfig: { data: null, isLoading: true, isRejected: false } }
        // case 'LOAD_TEMPCONFIG_SUCCESS':
        //     return { ...state, tempConfig: { data: action.payload, isLoading: false, isRejected: false } }
        // case 'LOAD_TEMPCONFIG_REJECTED':
        //     return { ...state, tempConfig: { data: action.payload, isLoading: false, isRejected: true } }

        //เก็บ state การดึงข้อมูล temperature
        case 'LOAD_TEMP_PENDING':
            return { ...state, temp: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_TEMP_SUCCESS':
            return { ...state, temp: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_TEMP_REJECTED':
            return { ...state, temp: { data: action.payload, isLoading: false, isRejected: true } }

        //เก็บ state tempearture config
        case 'SAVE_TEMPCONFIG_SUCCESS':
            return { ...state, configSave: { data: null, isLoading: false, isRejected: false } }
        case 'SAVE_TEMPCONFIG_REJECTED':
            return { ...state, configSave: { data: action.payload, isLoading: false, isRejected: true } }
        default:
            return state
    }
}