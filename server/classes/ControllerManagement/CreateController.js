const mongoose = require("mongoose");
const know_controller = mongoose.model("know_controller");

export default class CreateController {
  constructor(req, res) {
    this.operation(req, res);
  }

  async operation(req, res) {
    console.log("[CreateController] session id: " + req.session.id);
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(401);
      return;
    }

    let ip = req.body.ip;
    let macAddress = req.body.mac_address;
    let name = req.body.name;

    if (isHavePump === false) {
      moisture = false;
      water = false;
      fertilizer = false;
    } else {
      moisture = req.body.moisture;
      water = req.body.water;
      fertilizer = req.body.fertilizer;
    }

    await findAndUpdateController(
      ip,
      macAddress,
      name,
      projectId,
      greenHouseId,
      farmId,
      controllerType,
      moisture,
      water,
      fertilizer,
      function (assignControllerResult) {
        if (assignControllerResult) {
          res.sendStatus(200);
        } else {
          res.sendStatus(500);
        }
      }
    );
  }
}

async function findAndUpdateController(
  ip,
  macAddress,
  name,
  projectId,
  greenHouseId,
  farmId,
  controllerType,
  moisture,
  water,
  fertilizer,
  callback
) {
  let assignControllerResult = null;

  await know_controller.findOneAndUpdate({
      ip: ip,
      macAddress: macAddress,
      piMacAddress: piMacAddress,
      projectId: null
    }, {
      $set: {
        name: name,
        projectId: projectId,
        greenHouseId: greenHouseId,
        farmId: farmId,
        controllerType: controllerType,
        pumpType: {
          moisture: moisture,
          water: water,
          fertilizer: fertilizer
        },
        isHavePump: isHavePump,
        piMacAddress: piMacAddress
      }
    },
    function (err, doc) {
      if (err) {
        assignControllerResult = false;
        console.log("[CreateController] findAndUpdateController (err): " + err);
      } else if (!doc) {
        assignControllerResult = false;
        console.log("[CreateController] findAndUpdateController (!doc): " + doc);
      } else {
        assignControllerResult = true;
      }
      callback(assignControllerResult);
    }
  );
}