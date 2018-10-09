const mongoose = require('mongoose');
const greenHouse = mongoose.model('greenHouse');

let greenHouseDataResult = undefined;


export default class ShowGreenHouse{

    constructor(req,res){
        this.operation(req,res);
    }

    async operation(req,res){

        console.log('[userDataResult] session id: ' + req.session.id);
        if(typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined"){
            console.log(req.session.farmData + " / " + req.session.configFilePath)
            res.sendStatus(500);
            return;
        }

        let farmId = req.body.farmId;
        if (typeof farmId === "undefined") {
            res.json({
                status: 500,
                errorMessage: "เกิดข้อผิดพลาดในการเเสดงข้อมูลGreenHouseทั้งหมด"
            });
            return;
        }

        await getGreenHouseData(farmId);

        setTimeout(() => {
            if (typeof userDataResult == "undefined") {
                res.json({
                    status: 500,
                    errorMessage: "เกิดข้อผิดพลาดไม่มีข้อมูลGreenHouse"
                });
                return;
            }
            res.json(userDataResult);
        },200)
    }


}


async function getGreenHouseData(farmId){
    await greenHouse.find({
        farmId:farmId,
    },(err, result)=>{
        if(err){
            userDataResult = undefined;
            console.log('[greenHouseDataResult] getGreenHouseData(err): ' + err);
        }else if(!result){
            userDataResult = undefined;
            console.log('[greenHouseDataResult] getGreenHouseData(!result): ' + result);
        }else{
            userDataResult = result;
        }
    })
}