const mongoose = require('mongoose');

const{Schema} = mongoose;

const greenHouse_SensorSchema = new Schema({
    greenHouseSensorId : number,
    temperature : number,
    humidity : number ,
    soilMoisture : number,
    ambientLight : number,
    timeStamp : Date,
    greenHouseId : number
});

mongoose.model('greenHouse_Sensor',)