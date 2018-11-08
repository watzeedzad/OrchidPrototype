import AddProject from '../classes/ProjectManagement/AddProject'
import DeleteProject from '../classes/ProjectManagement/DeleteProject';
import EditProject from '../classes/ProjectManagement/EditProject';
import ShowProject from '../classes/ProjectManagement/ShowProject';


const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs-extra");
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let path = "../OrchidPrototype-Client/public/assets/images/project"
        fs.mkdirpSync(path);
        callback(null, path);
    },
    filename: function (req, file, callback) {
        let hash = crypto.createHash("sha256");
        hash.update(file.fieldname + "-" + Date.now());
        let renameFile = hash.digest("hex") + ".jpg";
        callback(null, renameFile);
    }
});
const uploadMulter = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    }
});

router.use('/addProject', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    next();
});

router.post('/addProject', uploadMulter.single('picture'), (req, res) => {
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

router.post('/deleteProject' ,(req,res)=>{
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

router.post('/editProject', (req,res)=>{
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

router.post('/showProject', (req,res)=>{
    new ShowProject(req,res);
});

module.exports = router;


