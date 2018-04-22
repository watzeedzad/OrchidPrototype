//ก�ำหนดค่าเริ่มต้นให้ state เช่น เช็คว่าข้อมูลที่ดึงมา error หรือไม่เราก็จะเช็คจาก isRejected
//ซึ่งถ้าเราไม่ก�ำหนด state เริ่มต้นก็จะไม่มี object ชื่อ isRejected ให้เรียกใช้งาน
const initialState = {
    configSave: { data: null, isLoading: true, isRejected: false },
}
export default (state = initialState, action) => {
    switch (action.type) {
        //เก็บ state สถานะการบันทึกข้อมูลสถานที่
        case 'SAVE_WEATHERCONFIG_SUCCESS':
            return { ...state, configSave: { data: null, isLoading: false, isRejected: false } }
        case 'SAVE_WEATHERCONFIG_REJECTED':
            return { ...state, configSave: { data: action.payload, isLoading: false, isRejected: true } }
        default:
            return state
    }
}