const mongoose = require('mongoose');
const greenHouse = mongoose.model('greenHouse');

let editGreenHouseResult ; 

export default class EditGreenHouse{

    constructor(req,res){
        this.operation(req,res);
    }

    async operation(req,res){
        console.log("[FertilizerConfig] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let id = req.body.id;
        let name = req.body.name;
        let desc = req.body.desc;
        let picturePath = req.body.picturePath;

        await findOneAndUpdateGreenHouse(id,name,desc,picturePath);

        if(editGreenHouseResult){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }

    }   

}

async function findOneAndUpdateGreenHouse(id,name,desc,picturePath){

    greenHouse.findOneAndUpdate({
        _id:id
    },{
        $set:{
            name:name,
            desc:desc,
            picturePath:picturePath
        }
    },(err,doc)=>{
        if(err){
            editGreenHouseResult = false;
            console.log("[editGreenHouseResult] findOneAndUpdateGreenHouse (err): " + err);
        }else if(!doc){
            editGreenHouseResult = false;
            console.log("[editGreenHouseResult] findOneAndUpdateGreenHouse (!doc): " + doc);
        }else{
            editGreenHouseResult = true;
        }
    });

}