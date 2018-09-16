import CreateController from "../classes/ControllerManagement/CreateController";
import ShowAllGreenHouse from "../classes/ControllerManagement/ShowAllGreenHouse";
import ShowAllGreenHouseController from "../classes/ControllerManagement/ShowAllGreenHouseController";
import ShowAllProject from "../classes/ControllerManagement/ShowAllProject";
import ShowAllProjectController from "../classes/ControllerManagement/ShowAllProjectController";
import DeleteController from "../classes/ControllerManagement/DeleteController";
import EditController from "../classes/ControllerManagement/EditController";
import GetDropdownController from '../classes/ControllerManagement/GetDropdownController';

const express = require("express");
const router = express.Router();

router.use("/createController", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type", "application/json");
    next();
});

router.post("/createController", (req, res) => {
    new CreateController(req, res);
});

//showAllGreenHouse
router.use("/showAllGreenHouse",(req,res,next)=>{

    res.setHeader("Access-Control-Allow-Origin",origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type","application/json");
    next();
});

router.post("/showAllGreenHouse",(req,res)=>{
    new ShowAllGreenHouse(req,res);
})

//showAllGreenHouseController
router.use("/showAllGreenHouseController",(req,res,next)=>{

    res.setHeader("Access-Control-Allow-Origin",origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type","application/json");
    next();
});

router.post("/showAllGreenHouseController",(req,res)=>{
    new ShowAllGreenHouseController(req,res);
})

//showAllProject
router.use("/showAllProject",(req,res,next)=>{

    res.setHeader("Access-Control-Allow-Origin",origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type","application/json");
    next();
});

router.post("/showAllProject",(req,res)=>{
    new ShowAllProject(req,res);
})


//showAllProjectController
router.use("/showAllProjectController",(req,res,next)=>{

    res.setHeader("Access-Control-Allow-Origin",origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type","application/json");
    next();
});

router.post("/showAllProjectController",(req,res)=>{
    new ShowAllProjectController(req,res);
})


//DeleteController
router.use("/deleteController",(req,res,next)=>{

    res.setHeader("Access-Control-Allow-Origin",origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type","application/json");
    next();
});

router.post("/deleteController",(req,res)=>{
    new DeleteController(req,res);
});



//EditController
router.use("/editController",(req,res,next)=>{

    res.setHeader("Access-Control-Allow-Origin",origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type","application/json");
    next();
});

router.post("/editController",(req,res)=>{
    new EditController(req,res);
});


//GetDropdownController
router.use("/getDropdownController",(req,res,next)=>{

    res.setHeader("Access-Control-Allow-Origin",origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set("Content-Type","application/json");
    next();
});

router.post("/getDropdownController",(req,res)=>{
    new GetDropdownController(req,res);
});




module.exports = router;