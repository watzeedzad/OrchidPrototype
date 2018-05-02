import { combineReducers } from 'redux'
//redux-form จะท�ำการเก็บ state และมี reducer ในตัวของมันเอง
//ดังนั้นเวลาเราจะใช้งาน redux-form เราต้องท�ำเหมือนว่ามันคือ reducer ตัวหนึ่งด้วยครับ
import { reducer as formReducer } from 'redux-form'

import weatherReducers from './weatherReducers'
import planterReducers from './planterReducers'



const rootReducers = combineReducers({
    form: formReducer, //กำหนดชื่อ reducer ไว้ว่าชื่อ form นะครับตามค�ำแนะน�ำของ redux-form
    weatherReducers,
    planterReducers,
})
export default rootReducers