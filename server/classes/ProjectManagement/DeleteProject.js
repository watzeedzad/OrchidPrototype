const mongoose = require('mongoose');
const project = mongoose.model('project')

let deleteProjectResult 

export default class DeleteProject{

    constructor(req,res){
        this.operation(req,res);
    }

    async operation(req,res){
        console.log('[FertilizerConfig] session id: '  + req.session.id)
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let id = req.body.id;

        await findAndDeleteProject(id);

        if(deleteProjectResult){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    }
    
}

async function findAndDeleteProject(id){

    project.findOneAndRemove({
        _id:id
    }, (err,doc)=>{
        if(err){
            deleteProjectResult = false
            console.log('[DeleteProject] findAndDeleteProject(err): ' +err);
        }else if(!doc){
            deleteProjectResult = false 
            console.log('[DeleteProject] findAndDeleteProject(err): ' +doc);
        }else{
            deleteProjectResult = true;
        }
    })
}