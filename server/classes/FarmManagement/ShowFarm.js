const mongoose = require('mongoose');
const farm = mongoose.model('farm');
const user = mongoose.model('user');

let showFarmDataResult = undefined;

export default class ShowFarm{
    
    constructor(req,res){
        operation(req,res);
    }
}

async function operation(req, res) {

    console.log('[userDataResult] session id: ' + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
        console.log(req.session.farmData + " / " + req.session.configFilePath)
        res.sendStatus(401);
        return;
    }

    let farmId = req.body.farmId;
    if (typeof farmId === "undefined") {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลFarmทั้งหมด"
        });
        return;
    }

    showFarmDataResult = await getFarmData(farmId);

    if (showFarmDataResult == null) {
        res.json({
            status: 500,
            errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลFarm"
        });
        return;
    }
    res.json(showFarmDataResult);
}


async function getFarmData(farmId) {
    let result = await farm.aggregate([
        {$lookup:{
            from: user,
            localField: farmId,
            foreignField: farmId,
            as:'ownedFarm'
        }
    }],(err,result)=>{
        if(err){
            showFarmDataResult = null ;
            console.log('[ShowFarm] getFarmData(err): '+err);
        }else if(!result){
            showFarmDataResult = null ;
            console.log('[ShowFarm] getFarmData(!result): '+result);
        }else{
            showFarmDataResult = result;
        }
    });

    return result;
 
}