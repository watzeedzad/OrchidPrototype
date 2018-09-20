//กำหนดค่าเริ่มต้นให้ state เช่น เช็คว่าข้อมูลที่ดึงมา error หรือไม่เราก็จะเช็คจาก isRejected
//ซึ่งถ้าเราไม่กำหนด state  เริ่มต้นก็จะไม่มี object ชื่อ isRejected ให้เรียกใช้งาน
const initialState = {
    growthRate: { data: null, isLoading: true, isRejected: false },
    farmCSV: { data: null, isLoading: true, isRejected: false },
    greenHouseCSV: { data: null, isLoading: true, isRejected: false },
    projectCSV: { data: null, isLoading: true, isRejected: false },
    growthRateSave: { data: null, isLoading: true, isRejected: false },
}

export default (state = initialState, action) => {
    switch (action.type) {
        //เก็บ state การดึงข้อมูลผู้ใช้ทั้งหมด
        case 'LOAD_FARMCSV_PENDING':
            return { ...state, farmCSV: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_FARMCSV_SUCCESS':
            return { ...state, farmCSV: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_FARMCSV_REJECTED':
            return { ...state, farmCSV: { data: action.payload, isLoading: false, isRejected: true } }

        case 'LOAD_GREENHOUSECSV_PENDING':
            return { ...state, greenHouseCSV: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_GREENHOUSECSV_SUCCESS':
            return { ...state, greenHouseCSV: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_GREENHOUSECSV_REJECTED':
            return { ...state, greenHouseCSV: { data: action.payload, isLoading: false, isRejected: true } }

        case 'LOAD_PROJECTCSV_PENDING':
            return { ...state, projectCSV: { data: null, isLoading: true, isRejected: false } }
        case 'LOAD_PROJECTCSV_SUCCESS':
            return { ...state, projectCSV: { data: action.payload, isLoading: false, isRejected: false } }
        case 'LOAD_PROJECTCSV_REJECTED':
            return { ...state, projectCSV: { data: action.payload, isLoading: false, isRejected: true } }

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