const mongoose = require('mongoose');
const user = mongoose.model('user');

let editUserResult ;

export default class EditUser{
    
    constructor(req,res){
        this.operation(req,res);
    }

    async operation(req,res){
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;

        await editUserData(firstName,lastName);

        if(editUserResult){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    }
} 

async function editUserData(userId){
    user.findOneAndUpdate({
        userId:userId
    },{
        $set:{
            firstName:firstName,
            lastName:lastName
        }
    },(err,doc)=>{
        if(err){
            editUserResult = false;
            console.log("[EditUser] editUserData (err): "+err);
        }else if(!doc){
            editUserData = false;
            console.log('[EditUser] editUserData (!doc): '+doc);
        }else{
            editUserResult = true;
        }
    })
}