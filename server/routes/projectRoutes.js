import AddProject from '../classes/ProjectManagement/AddProject'
import DeleteProject from '../classes/ProjectManagement/DeleteProject';
import EditProject from '../classes/ProjectManagement/EditProject';
import ShowProject from '../classes/ProjectManagement/ShowProject';


const express = require('express');
const router = express.Router();


router.use('/addProject', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type', 'application/json');
    next();
});

router.post('/addProject', (req, res) => {
    new AddProject(req, res);
});

router.use('/deleteProject',(req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type','application/json');
    next();
});

router.delete('/deleteProject' ,(req,res)=>{
    new DeleteProject(req,res);
});


router.use('/editProject', (req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type','application/json');
    next();
});

router.put('/editProject', (req,res)=>{
    new EditProject(req,res);
});



router.use('/showProject', (req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type','application/json');
    next();
});

router.get('/showProject', (req,res)=>{
    new ShowProject(req,res);
});

module.exports = router;


