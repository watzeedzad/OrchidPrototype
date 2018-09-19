//กำหนดค่าเริ่มต้นให้ state เช่น เช็คว่าข้อมูลที่ดึงมา error หรือไม่เราก็จะเช็คจาก isRejected
//ซึ่งถ้าเราไม่กำหนด state  เริ่มต้นก็จะไม่มี object ชื่อ isRejected ให้เรียกใช้งาน
const initialState = {
    growthRate: { data: null, isLoading: true, isRejected: false },
    csvGrowthRate: { data: null, isLoading: true, isRejected: false },
    growthRateSave: { data: null, isLoading: true, isRejected: false },
}

export default (state = initialState, action) => {
    switch (action.type) {
        //เก็บ state การดึงข้อมูลผู้ใช้ทั้งหมด
        case 'LOAD_CSVGROWTHRATE_PENDING':
            return { ...state, csvGrowthRate: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_CSVGROWTHRATE_SUCCESS':
            return { ...state, csvGrowthRate: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_CSVGROWTHRATE_REJECTED':
            return { ...state, csvGrowthRate: { data: action.payload, isLoading: false, isRejected: true } }

        //เก็บ state การดึงข้อมูลผู้ใช้ตาม id ที่ส่งไป
        case 'LOAD_GROWTHRATE_PENDING':
            return { ...state, growthRate: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_GROWTHRATE_SUCCESS':
            return { ...state, growthRate: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_GROWTHRATE_REJECTED':
            return { ...state, growthRate: { data: action.payload, isLoading: false, isRejected: true } }

        //เก็บ state สถานะการบันทึกข้อมูลผู้ใช้
        case 'SAVE_GROWTHRATE_SUCCESS':
            return { ...state, growthRateSave: { data: null, isLoading: false, isRejected: false } }
        case 'SAVE_GROWTHRATE_REJECTED':
            return { ...state, growthRateSave: { data: action.payload, isLoading: false, isRejected: true } }

        default:
            return state
    }
}