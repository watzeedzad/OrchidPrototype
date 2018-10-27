const mongoose = require("mongoose");
const knowController = mongoose.model("know_controller");

let deleteControllerResult;

export default class CreateController {
    constructor(req, res) {
        this.operation(req, res);
    }

    async operation(req, res) {
        console.log("[DeleteController] session id: " + req.session.id);
        if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
            res.sendStatus(401);
            return;
        }

        let id = req.body.id;

        if (typeof id === "undefined") {
            res.json({
                status: 500,
                errorMessage: "id is null"
            });
            return;
        }

        await deleteController(id);

        if (deleteControllerResult) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

async function deleteController(id) {
    await knowController.findOneAndRemove({
        _id: id,
    }, (err, doc) => {
        if (err) {
            deleteControllerResult = false;
            console.log("[deleteControllerResult] findAndDeleteController (err):  " + err);
        } else if (!doc) {
            deleteControllerResult = false;
            console.log('[deleteControllerResult] findAndDeleteController(!doc): ' + doc);
        } else {
            deleteControllerResult = true;
        }
    });
}