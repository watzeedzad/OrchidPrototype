import InsertRelayCommand from "../Utils/InsertRelayCommand";

const mongoose = require("mongoose");
const fs = require("fs");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");
const project = mongoose.model("project");

let farmData;
let configFile;
let controllerData;
let minFertility;
let maxFertility;

export default class FertilityCheck {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    // let ipIn = req.body.ip;
    // if (typeof ipIn === "undefined" || typeof piMacAddress === "undefined") {
    //     req.session.fertilityCheckStatus = 500;
    //     return;
    // }
    // let controllerResult = await know_controller.findOne({
    //     ip: ipIn,
    //     piMacAddress: piMacAddress
    // }, function (err, result) {
    //     if (err) {
    //         console.log("[FertilityCheck] Query fail!, know_controller");
    //     } else {
    //         console.log("[FertilityCheck] Query success, know_controller")
    //     }
    // });
    let piMacAddress = req.body.piMacAddress;
    let projectId = req.body.projectId;
    let farmId = req.body.farmId;
    let summarizedSensorData = req.body.summarizedSensorData;
    if (
      typeof projectid === "undefined" ||
      typeof farmId === "undefined" ||
      typeof piMacAddress === "undefined" ||
      typeof summarizedSensorData === "undefined"
    ) {
      req.session.fertilityCheckStatus = 500;
      return;
    }
    await getConfigFile(farmId);
    console.log("[FertilityCheck] projectId_Class, " + projectId);
    console.log("[FertilityCheck] farmId_Class, " + farmId);
    await getControllerData(projectId, farmData.farmId);
    if (typeof controllerData === "undefined") {
      req.session.fertilityCheckStatus = 200;
      return;
    }
    let projectIdIndex = await seekProjectIdIndex(
      configFile.fertilityConfigs,
      projectId
    );
    console.log("[FertilityCheck] projectIdIndex: " + projectIdIndex);
    if (projectIdIndex == -1) {
      req.session.fertilityCheckStatus = 500;
      return;
    }
    for (let index = 0; index < summarizedSensorData.length; index++) {
      let resultCompareFertility = await compareFertility(
        configFile,
        summarizedSensorData[index].soilFertility,
        projectIdIndex
      );
      console.log(
        "[FertilityCheck] compareFertility: " + resultCompareFertility
      );
      if (typeof resultCompareFertility === "undefined") {
        req.session.fertilityCheckStatus = 500;
        return;
      } else {
        console.log("[FertilityCheck] enter insert relay command phase");
        if (resultCompareFertility) {
          new InsertRelayCommand(
            controllerData.ip,
            "fertilizer",
            true,
            farmData.piMacAddress
          );
          console.log(
            "[FertilityCheck] farmData.piMacAddress: " + farmData.piMacAddress
          );
          // onOffFertilizerPump(controllerData.ip, true);
        } else {
          new InsertRelayCommand(
            controllerData.ip,
            "fertilizer",
            false,
            farmData.piMacAddress
          );
          console.log(
            "[FertilityCheck] farmData.piMacAddress: " + farmData.piMacAddress
          );
          // onOffFertilizerPump(controllerData.ip, false);
        }
        req.session.fertilityCheckStatus = 200;
        return;
      }
    }
  }
}

async function getControllerData(projectId, farmId) {
  console.log(
    "[FertilityCheck] getControllerData: " + projectId + ", " + farmId
  );
  await know_controller.findOne(
    {
      isHavePump: true,
      "pumpType.fertilizer": true,
      projectId: projectId,
      farmId: farmId
    },
    function(err, result) {
      if (err) {
        controllerData = undefined;
        console.log("[FertilityCheck] Query fail!, know_controller2");
      } else if (!result) {
        console.log("[FertilityCheck] getControllerData (!result): " + result);
      } else {
        controllerData = result;
        console.log("[FertilityCheck] getControllerData (result): " + result);
      }
    }
  );
}

// function onOffFertilizerPump(ip, state) {
//     if (state) {
//         console.log("Send: /fertilizerPump?params=0 (on)");
//         request
//             .get("http://" + String(ip) + "/fertilizerPump?params=0", {
//                 timeout: 20000
//             })
//             .on("error", function (err) {
//                 console.log(err.code === "ETIMEDOUT");
//                 console.log(err.connect === true);
//                 console.log(err);
//             });
//     } else {
//         console.log("Send: /fertilizerPump?params=1 (off)");
//         request
//             .get("http://" + String(ip) + "/fertilizerPump?params=1", {
//                 timeout: 20000
//             })
//             .on("error", function (err) {
//                 console.log(err.code === "ETIMEDOUT");
//                 console.log(err.connect === true);
//                 console.log(err);
//             });
//     }
// }

async function getConfigFile(farmIdIn) {
  let farmResult = await farm.findOne(
    {
      farmId: farmIdIn
    },
    function(err, result) {
      if (err) {
        console.log("[FertilityCheck] getConfigFile, fail");
      } else {
        console.log("[FertilityCheck] getConfigFile, pass");
        farmData = result;
      }
    }
  );
  let configFilePath = farmResult.configFilePath;
  let config = JSON.parse(fs.readFileSync(String(configFilePath), "utf8"));
  configFile = config;
}

function compareFertility(configFile, currentFertility, projectIdIndex) {
  minFertility = configFile.fertilityConfigs[projectIdIndex].minFertility;
  maxFertility = configFile.fertilityConfigs[projectIdIndex].maxFertility;
  console.log("[FertilityCheck] MIN-F: " + minFertility);
  console.log("[FertilityCheck] MAX-F: " + maxFertility);
  console.log("[FertilityCheck] CURRENT-F: " + currentFertility);
  if (minFertility == null || maxFertility == null) {
    return undefined;
  } else if (minFertility < currentFertility) {
    return false;
  } else if (minFertility > currentFertility) {
    return true;
  }
}

function seekProjectIdIndex(dataArray, projectId) {
  console.log(dataArray);
  let index = dataArray.findIndex(function(item, i) {
    return item.projectId === projectId;
  });
  return index;
}
