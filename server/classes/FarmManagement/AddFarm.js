const mongoose = require('mongoose');
const farm = mongoose.model('farm');

let addFarmResult ; 

export default class AddFarm{

    constructor(req,res){
        this.operation(req,res);
    }

    async operation(req,res){
       
        let ownerName = req.body.ownerName ;
        let ownerSurname = req.body.ownerSurname ;
        let ownerTel = req.body.ownerTel ;
        let ownerAddress = req.body.ownerAddress ;
        let configFilePath = req.body.configFilePath ;
        let pimac = req.body.pimac ;

        await addFarm(ownerName,ownerSurname,ownerTel,ownerAddress,configFilePath,pimac);

        if(addFarmResult){
            res.sendStatus(200);
        }else{
            res.sendStatus(500)
        }
    }


}

async function addFarm(farmId,ownerName,ownerSurname,ownerTel,ownerAddress,configFilePath,pimac){

    let farmData = new farm({
        farmId:farmId,
        ownerName:ownerName,
        ownerSurname:ownerSurname,
        ownerTel:ownerTel,
        ownerAddress:ownerAddress,
        configFilePath:configFilePath,
        pimac:pimac
    });

    console.log(farmData);

    farmData.save(function(err,dox){
        if(err){
            addFarmResult = false;
            console.log('[AddFarm] addFarm(err): ' +err);
        }else if(!doc){
            addFarmResult = false;
            console.log('[AddFarm] addFarm(!doc): '+doc);
        }else{
            addFarmResult = true;
        }
    })
}