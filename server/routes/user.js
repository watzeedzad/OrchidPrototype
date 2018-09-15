import AddUser from '../classes/UserManagement/AddUser';
import DeleteUser from '../classes/UserManagement/DeleteUser';
import EditUser from '../classes/UserManagement/EditUser';
import ShowUser from '../classes/UserManagement/ShowUser';
import SearchUser from '../classes/UserManagement/SearchUser';


const express = require('express');
const router = express.Router();

router.use("/addUser", (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', origin_url);
    res.setHeader(
        'Access-Control-Allow-Headder',
        'X-Requested-With,content-type'
    );
    res.set("Content_type", "application/json");
    next();
});

router.post("/addUser", (req, res) => {
    new AddUser(req, res);
});

router.use("/deleteUser", (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', origin_url);
    res.setHeader(
        'Access-Control-Allow-Headder',
        'X-Requested-With,content-type'
    );
    res.set("Content_type", "application/json");
    next();
});

router.post("/deleteUser", (req, res) => {
    new DeleteUser(req, res);
});


router.use("/editUser", (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', origin_url);
    res.setHeader(
        'Access-Control-Allow-Headder',
        'X-Requested-With,content-type'
    );
    res.set("Content_type", "application/json");
    next();
});

router.post("/editUser", (req, res) => {
    new EditUser(req,res);
});

router.use("/showUser", (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', origin_url);
    res.setHeader(
        'Access-Control-Allow-Headder',
        'X-Requested-With,content-type'
    );
    res.set("Content_type", "application/json");
    next();
});

router.post('/showUser',(req,res)=>{
    new ShowUser(req,res);
})

router.use("/searchUser", (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', origin_url);
    res.setHeader(
        'Access-Control-Allow-Headder',
        'X-Requested-With,content-type'
    );
    res.set("Content_type", "application/json");
    next();
});

router.post('/searchUser',(req,res)=>{
    new SearchUser(req,res);
})

module.exports = router;