import AddGreenHouse from '../classes/GreenHouseManagement/AddGreenHouse';
import DeleteGreenHouse from '../classes/GreenHouseManagement/DeleteGreenHouse';
import EditGreenHouse from '../classes/GreenHouseManagement/EditGreenHouse';
import ShowGreenHouse from '../classes/GreenHouseManagement/ShowGreenHouse';

const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs-extra");
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let path = "../OrchidPrototype-Client/public/assets/images/greenhouse"
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

router.use('/addGreenHouse', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    next();
});

router.post('/addGreenHouse', uploadMulter.single('picture'), (req, res) => {
    new AddGreenHouse(req, res);
});

router.use('/deleteGreenHouse', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type', 'application/json');
    next();
});

router.post('/deleteGreenHouse', (req, res) => {
    new DeleteGreenHouse(req, res);
});


router.use('/editGreenHouse', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type', 'application/json');
    next();
});

router.post('/editGreenHouse', (req, res) => {
    new EditGreenHouse(req, res);
});


router.use('/showGreenHouse', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin_url);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.set('Content-Type', 'application/json');
    next();
});

router.post('/showGreenHouse', (req, res) => {
    new ShowGreenHouse(req, res);
});

module.exports = router;