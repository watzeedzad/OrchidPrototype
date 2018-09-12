import { combineReducers } from 'redux'
//redux-form จะท�ำการเก็บ state และมี reducer ในตัวของมันเอง
//ดังนั้นเวลาเราจะใช้งาน redux-form เราต้องท�ำเหมือนว่ามันคือ reducer ตัวหนึ่งด้วยครับ
import { reducer as formReducer } from 'redux-form'

import weatherReducers from './weatherReducers'
import planterReducers from './planterReducers'
import waterReducers from './waterReducers'
import fertilizerReducers from './fertilizerReducers'
import lightReducers from './lightReducers'
import controllerReducers from './controllerReducers'
import userReducers from './UserReducers'


const rootReducers = combineReducers({
    form: formReducer, //กำหนดชื่อ reducer ไว้ว่าชื่อ form นะครับตามค�ำแนะน�ำของ redux-form
    weatherReducers,
    planterReducers,
    waterReducers,
    fertilizerReducers,
    lightReducers,
    controllerReducers,
    userReducers
})
export default rootReducers