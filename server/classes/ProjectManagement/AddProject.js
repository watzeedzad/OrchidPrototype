const mongoose = require('mongoose');
const project = mongoose.model('project')

let addProjectResult 

export default class AddProject{

    constructor(req,res){
        this.operation(req,res)
    }

    async operation(req,res){
        console.log("[FertilizerConfig] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let farmId = req.body.farmId ;
        let greenHouseId = req.body.greenHouseId ;
        let tribeName = req.body.tribeName ;
        let picturePath = req.body.picturePath ;
        let isAutoFertilizering = req.body.isAutoFertilizering ;
        let currentRatio  = req.body.currentRatio ;

        await addProject(farmId,greenHouseId,tribeName,picturePath,isAutoFertilizering,currentRatio);

        if(addProjectResult){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    }

}


async function addProject(farmId,greenHouseId,tribeName,picturePath,isAutoFertilizering,currentRatio){

    let projectData = new project({

        farmId:farmId,
        greenHouseId:greenHouseId,
        tribeName:tribeName,
        picturePath:picturePath,
        isAutoFertilizering:isAutoFertilizering,
        currentRatio:currentRatio
    });

    console.log(projectData)

    projectData.save(function(err,doc){
        if(err){
            addProjectResult = false;
            console.log('[AddProject] addProject(err):  ' + err);
        }else if(!doc){
            addProjectResult = false;
            console.log('[AddProject] addProject(!doc): '+ doc);
        }else{
            addProjectResult = true;
        }
    })


}