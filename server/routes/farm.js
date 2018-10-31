import AddFarm from '../classes/FarmManagement/AddFarm';
import DeleteFarm from '../classes/FarmManagement/DeleteFarm';
import EditFarm from '../classes/FarmManagement/EditFarm'
import ShowFarm from '../classes/FarmManagement/ShowFarm';


const express = require('express');
const router = express.Router();


router.use('/addFarm', (req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type','application/json');
    next();
});

router.post('/addFarm', (req,res)=>{
    new AddFarm(req,res);
});


router.use('/deleteFarm',(req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type','application/json');
    next();
});

router.delete('/deleteFarm' ,(req,res)=>{
    new DeleteFarm(req,res);
});

router.use('/editFarm', (req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type','application/json');
    next();
});

router.put('/editFarm', (req,res)=>{
    new EditFarm(req,res);
});

router.use("/showFarm", (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', origin_url);
    res.setHeader(
        'Access-Control-Allow-Headder',
        'X-Requested-With,content-type'
    );
    res.set("Content_type", "application/json");
    next();
});

router.post('/showFarm',(req,res)=>{
    new ShowFarm(req,res);
})

module.exports = router;
