import AddGreenHouse from '../classes/GreenHouseManagement/AddGreenHouse';
import DeleteGreenHouse from '../classes/GreenHouseManagement/DeleteGreenHouse';
import EditGreenHouse from '../classes/GreenHouseManagement/EditGreenHouse';
import ShowGreenHouse from '../classes/GreenHouseManagement/ShowGreenHouse';

const express = require('express');
const router = express.Router();

router.use('/addGreenHouse', (req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type','application/json');
    next();
});

router.post('/addGreenHouse', (req,res)=>{
    new AddGreenHouse(req,res);
});

router.use('/deleteGreenHouse',(req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type','application/json');
    next();
});

router.delete('/deleteGreenHouse' ,(req,res)=>{
    new DeleteGreenHouse(req,res);
});


router.use('/editGreenHouse', (req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type','application/json');
    next();
});

router.put('/editGreenHouse', (req,res)=>{
    new EditGreenHouse(req,res);
});


router.use('/showGreenHouse', (req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type','application/json');
    next();
});

router.get('/showGreenHouse', (req,res)=>{
    new ShowGreenHouse(req,res);
});

module.exports = router;
