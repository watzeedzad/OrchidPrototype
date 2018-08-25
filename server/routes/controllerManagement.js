import CreateController from "../classes/ControllerManagement/CreateController";
import ShowAllGreenHouseController from "../classes/ControllerManagement/ShowAllGreenHouseController";
import ShowAllProjectController from "../classes/ControllerManagement/ShowAllProjectController";
import DeleteController from "../classes/ControllerManagement/DeleteController";
import EditController from "../classes/ControllerManagement/EditController";

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
module.exports = router;