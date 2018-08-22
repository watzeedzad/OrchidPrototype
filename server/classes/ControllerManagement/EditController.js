const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");

export default class EditController {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {

    }
}

async function editControllerData(params) {
    
}