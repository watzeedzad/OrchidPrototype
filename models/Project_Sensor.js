const mongoose = require('mongoose');

const{Schema} = mongoose;

const project_SensorSchema = new Schema({
    projectSensorId : number,
    soilFertilizer : number,
    timeStamp : Date,
    projectId : number
});

mongoose.model('project_Sensor',project_SensorSchema);