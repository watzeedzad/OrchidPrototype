//ก�ำหนดค่าเริ่มต้นให้ state เช่น เช็คว่าข้อมูลที่ดึงมา error หรือไม่เราก็จะเช็คจาก isRejected
//ซึ่งถ้าเราไม่ก�ำหนด state เริ่มต้นก็จะไม่มี object ชื่อ isRejected ให้เรียกใช้งาน
const initialState = {
    moistureConfig: { data: null, isLoading: true, isRejected: false },
    moisture: { data: null, isLoading: true, isRejected: false },
}
export default (state = initialState, action) => {
    switch (action.type) {
        
        case 'LOAD_MOISTURE_PENDING':
            return { ...state, moisture: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_MOISTURE_SUCCESS':
            return { ...state, moisture: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_MOISTURE_REJECTED':
            return { ...state, moisture: { data: action.payload, isLoading: false, isRejected: true } }

        case 'SAVE_MOISTURECONFIG_SUCCESS':
            return { ...state, moistureConfig: { data: null, isLoading: false, isRejected: false } }
        case 'SAVE_MOISTURECONFIG_REJECTED':
            return { ...state, moistureConfig: { data: action.payload, isLoading: false, isRejected: true } }

        default:
            return state
    }
}