//ก�ำหนดค่าเริ่มต้นให้ state เช่น เช็คว่าข้อมูลที่ดึงมา error หรือไม่เราก็จะเช็คจาก isRejected
//ซึ่งถ้าเราไม่ก�ำหนด state เริ่มต้นก็จะไม่มี object ชื่อ isRejected ให้เรียกใช้งาน
const initialState = {
    gController: { data: null, isLoading: true, isRejected: false },

}
export default (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_GCONTROLLER_PENDING':
            return { ...state, gController: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_GCONTROLLER_SUCCESS':
            return { ...state, gController: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_GCONTROLLER_REJECTED':
            return { ...state, gController: { data: action.payload, isLoading: false, isRejected: true } }

        default:
            return state
    }
}