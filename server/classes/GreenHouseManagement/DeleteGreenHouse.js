const mongoose = require('mongoose');
const greenHouse = mongoose.model('greenHouse');

let deleteGreenHouseResult;

export default class DeleteGreenHouse{

    constructor(req,res){
        this.operation(req,res);
    }

    async operation(req,res){

        let id = req.body.id;

        await findAndDeleteGreenHouse(id);

        if(deleteGreenHouseResult){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    }
}

async function findAndDeleteGreenHouse(id){

    greenHouse.findOneAndRemove({
        _id: id
    },(err,doc)=>{
        if(err){
            deleteGreenHouseResult = false;
            console.log('[deleteGreenHouseResult] findAndDeleteGreenHouse(err): ' + err);
        }else if(!doc){
            deleteGreenHouseResult = false;
            console.log('[deleteGreenHouseResult] findAndDeleteGreenHouse(!doc): ' + doc);
        }else{
            deleteGreenHouseResult = true;
        }
    })


}