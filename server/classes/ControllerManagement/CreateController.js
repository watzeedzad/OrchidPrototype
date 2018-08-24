const mongoose = require("mongoose");
const know_controller = mongoose.model("know_controller");

let assignControllerResult;

export default class CreateController {
  constructor(req, res) {
    this.operation(req, res);
  }

  async operation(req, res) {
    let ip = req.body.ip;
    let macAddress = req.body.mac_address;
    let name = req.body.name;
    let projectId = req.body.projectId;
    let greenHouseId = req.body.greenHouseId;
    let farmId = req.body.farmId;
    let controllerType = req.body.controllerType;
    let isHavePump = req.body.isHavePump;
    let moisture;
    let water;
    let fertilizer;

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
      fertilizer
    );

    if (assignControllerResult) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  }
}

// async function saveControllerData(
//   ip,
//   macAddress,
//   name,
//   projectId,
//   greenHouseId,
//   farmId,
//   moisture,
//   water,
//   fertilizer,
//   isHavePump,
//   piMacAddress
// ) {
//   const newKnowControllerData = {
//     ip: ip,
//     mac_address: macAddress,
//     name: name,
//     projectId: projectId,
//     greenHouseId: greenHouseId,
//     farmId: farmId,
//     pumpType: {
//       moisture: moisture,
//       water: water,
//       fertilizer: fertilizer
//     },
//     isHavePump: isHavePump,
//     piMacAddress: piMacAddress
//   };

//   new know_controller(newKnowControllerData).save(function(err) {
//     if (!err) {
//       console.log("[CreateControoler] created new controller!");
//     } else {
//       //TODO: return page with errors
//       return console.log(err);
//     }
//   });
// }

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
  isHavePump,
  piMacAddress
) {
  know_controller.findOneAndUpdate(
    {
      ip: ip,
      macAddress: macAddress,
      piMacAddress: piMacAddress
    },
    {
      $set: {
        name: name,
        projectId: projectId,
        greenHouseId: greenHouseId,
        farmId:farmId,
        controllerType:controllerType,
        pumpType: {
          moisture: moisture,
          water: water,
          fertilizer: fertilizer
        },
        isHavePump: isHavePump,
        piMacAddress: piMacAddress
      }
    },
    function(err, doc) {
      if (err) {
        assignControllerResult = false;
        console.log("[CreateController] findAndUpdateController (err): " + err);
      } else if (!doc) {
        assignControllerResult = false;
        console.log(
          "[CreateController] findAndUpdateController (!doc): " + doc
        );
      } else {
        assignControllerResult = true;
      }
    }
  );
}
