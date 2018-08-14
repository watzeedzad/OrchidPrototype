//ก�ำหนดค่าเริ่มต้นให้ state เช่น เช็คว่าข้อมูลที่ดึงมา error หรือไม่เราก็จะเช็คจาก isRejected
//ซึ่งถ้าเราไม่ก�ำหนด state เริ่มต้นก็จะไม่มี object ชื่อ isRejected ให้เรียกใช้งาน
const initialState = {
    intensity: { data: null, isLoading: true, isRejected: false },
    intensityConfig: { data: null, isLoading: true, isRejected: false },
    volume: { data: null, isLoading: true, isRejected: false },
    volumeConfig: { data: null, isLoading: true, isRejected: false },

}
export default (state = initialState, action) => {
    switch (action.type) {

        case 'LOAD_LIGHTINTENSITY_PENDING':
            return { ...state, intensity: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_LIGHTINTENSITY_SUCCESS':
            return { ...state, intensity: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_LIGHTINTENSITY_REJECTED':
            return { ...state, intensity: { data: action.payload, isLoading: false, isRejected: true } }

        case 'SAVE_LIGHTINTENSITY_SUCCESS':
            return { ...state, intensityConfig: { data: action.payload, isLoading: false, isRejected: false } }
        case 'SAVE_LIGHTINTENSITY_REJECTED':
            return { ...state, intensityConfig: { data: action.payload, isLoading: false, isRejected: true } }

        case 'LOAD_LIGHTVOLUME_PENDING':
            return { ...state, volume: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_LIGHTVOLUME_SUCCESS':
            return { ...state, volume: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_LIGHTVOLUME_REJECTED':
            return { ...state, volume: { data: action.payload, isLoading: false, isRejected: true } }

        case 'SAVE_LIGHTVOLUME_SUCCESS':
            return { ...state, volumeConfig: { data: action.payload, isLoading: false, isRejected: false } }
        case 'SAVE_LIGHTVOLUME_REJECTED':
            return { ...state, volumeConfig: { data: action.payload, isLoading: false, isRejected: true } }  

        default:
            return state
    }
}