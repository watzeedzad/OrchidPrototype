//ก�ำหนดค่าเริ่มต้นให้ state เช่น เช็คว่าข้อมูลที่ดึงมา error หรือไม่เราก็จะเช็คจาก isRejected
//ซึ่งถ้าเราไม่ก�ำหนด state เริ่มต้นก็จะไม่มี object ชื่อ isRejected ให้เรียกใช้งาน
const initialState = {
    waterConfig: { data: null, isLoading: true, isRejected: false },
}
export default (state = initialState, action) => {
    switch (action.type) {

        case 'SAVE_WATERCONFIG_SUCCESS':
            return { ...state, waterConfig: { data: null, isLoading: false, isRejected: false } }
        case 'SAVE_WATERCONFIG_REJECTED':
            return { ...state, waterConfig: { data: action.payload, isLoading: false, isRejected: true } }

        default:
            return state
    }
}