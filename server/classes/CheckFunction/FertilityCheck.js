import InsertRelayCommand from "../Utils/InsertRelayCommand";

const mongoose = require("mongoose");
const fs = require("fs");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");
const project = mongoose.model("project");

let configFile;
let controllerDataResult;
let minFertility;
let maxFertility;

export default class FertilityCheck {
  constructor(req) {
    this.process(req);
  }

  async process(req) {
    let projectId = req.body.projectId;
    let farmId = req.body.farmId;
    let soilFertility = req.body.soilFertility;
    let piMacAddress = req.body.piMacAddress;
    if (
      typeof projectId === "undefined" ||
      typeof farmId === "undefined" ||
      typeof soilFertility === "undefined" ||
      typeof piMacAddress === "undefined"
    ) {
      req.session.fertilityCheckStatus = 500;
      return;
    }
    await getConfigFile(farmId);
    controllerDataResult = await getControllerData(projectId, farmId);
    if (controllerDataResult == null) {
      req.session.fertilityCheckStatus = 200;
      return;
    }
    let projectIdIndexFertilizer = await seekProjectIdIndex(
      configFile.fertilityConfigs,
      projectId
    );
    let projectIdTimeIndex = await seekProjectIdIndex(
      configFile.fertilizer,
      projectId
    );
    console.log("[FertilityCheck] projectIdIndexFertilizer: " + projectIdIndexFertilizer);
    console.log("[FertilityCheck] projectIdTimeIndex: " + projectIdTimeIndex);
    if (projectIdIndexFertilizer == -1 || projectIdTimeIndex == -1) {
      req.session.fertilityCheckStatus = 500;
      return;
    }
    let checkTimeResult = false;
    let currentDate = new Date();
    for (let index = 0; index < configFile.fertilizer[projectIdTimeIndex].timeRanges.length; index++) {
      console.log("[FertilityCheck] enter loop: " + index);
      let tempDate = new Date(configFile.fertilizer[projectIdTimeIndex].timeRanges[index]);
      if (tempDate.getHours() == currentDate.getHours() && tempDate.getMinutes() == currentDate.getMinutes()) {
        console.log("[FertilityCheck] checkTime enter CASE 1");
        checkTimeResult = true;
        break;
      } else if (tempDate.getHours() == currentDate.getHours() && tempDate.getMinutes() < currentDate.getMinutes()) {
        console.log("[FertilityCheck] checkTime enter CASE 2");
        checkTimeResult = true;
        break;
      } else {
        console.log("[FertilityCheck] checkTime enter CASE 3");
        if ((currentDate.getHours() == tempDate.getHours()) || (currentDate.getHours() - tempDate.getHours() <= 2 && currentDate.getHours() - tempDate.getHours() >= 0)) {
          checkTimeResult = true;
          break;
        } else {
          checkTimeResult = false;
        }
      }
      console.log("[Fertility] end loop: " + index);
    }
    console.log("[FertilityCheck] checkTimeResult: " + checkTimeResult);
    if (!checkTimeResult) {
      new InsertRelayCommand(controllerDataResult.ip, "fertilizer", false, piMacAddress);
      await updateAutoFertilizeringStatus(farmId, projectId, false, function (updateAutoFertilizeringResultStatus) {
        if (updateAutoFertilizeringResultStatus) {
          req.session.fertilityCheckStatus = 200;
        } else {
          req.session.fertilityCheckStatus = 500;
        }
      });
      return;
    }
    let resultCompareFertility = await compareFertility(
      configFile,
      soilFertility,
      projectIdIndexFertilizer
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
          controllerDataResult.ip,
          "fertilizer",
          true,
          piMacAddress
        );
        console.log(
          "[FertilityCheck] piMacAddress: " + piMacAddress
        );
        await updateAutoFertilizeringStatus(farmId, projectId, true, function (updateAutoFertilizeringResultStatus) {
          if (updateAutoFertilizeringResultStatus) {
            req.session.fertilityCheckStatus = 200;
          } else {
            req.session.fertilityCheckStatus = 500;
          }
        });
      } else {
        new InsertRelayCommand(
          controllerDataResult.ip,
          "fertilizer",
          false,
          piMacAddress
        );
        console.log(
          "[FertilityCheck] piMacAddress: " + piMacAddress
        );
        await updateAutoFertilizeringStatus(farmId, projectId, false, function (updateAutoFertilizeringResultStatus) {
          if (updateAutoFertilizeringResultStatus) {
            req.session.fertilityCheckStatus = 200;
          } else {
            req.session.fertilityCheckStatus = 500;
          }
        });
      }
      return;
    }
  }
}

async function getControllerData(projectId, farmId) {
  console.log(
    "[FertilityCheck] getControllerData: " + projectId + ", " + farmId
  );
  let result = await know_controller.findOne({
      isHaveRelay: true,
      "relayType.fertilizer": true,
      projectId: projectId,
      farmId: farmId
    },
    function (err, result) {
      if (err) {
        controllerDataResult = undefined;
        console.log("[FertilityCheck] Query fail!, know_controller2");
      } else if (!result) {
        controllerDataResult = undefined;
        console.log("[FertilityCheck] getControllerData (!result): " + result);
      } else {
        controllerDataResult = result;
        console.log("[FertilityCheck] getControllerData (result): " + result);
      }
    }
  );
  return result;
}

async function getConfigFile(farmIdIn) {
  let farmResult = await farm.findOne({
      farmId: farmIdIn
    },
    function (err, result) {
      if (err) {
        console.log("[FertilityCheck] getConfigFile (err): " + err);
      } else if (!result) {
        console.log("[FertilityCheck] getConfigFile (!result): " + result);
      } else {
        console.log("[FertilityCheck] getConfigFile (result): " + result);
      }
    }
  );
  let configFilePath = farmResult.configFilePath;
  let config = JSON.parse(fs.readFileSync(String(configFilePath), "utf8"));
  configFile = config;
}

async function updateAutoFertilizeringStatus(farmId, projectId, status, callback) {
  let updateAutoFertilizeringResultStatus;

  await project.findOneAndUpdate({
    farmId: farmId,
    projectId: projectId
  }, {
    $set: {
      isAutoFertilizering: status
    }
  }, function (err, doc) {
    if (err) {
      console.log("[FertilityCheck] updateAutoFertilizeringStatus (err): " + err);
      updateAutoFertilizeringResultStatus = false;
    } else if (!doc) {
      console.log("[FertilityCheck] updateAutoFertilizeringStatus (!doc): " + err);
      updateAutoFertilizeringResultStatus = false;
    } else {
      updateAutoFertilizeringResultStatus = true;
    }
    callback(updateAutoFertilizeringResultStatus);
  });
}

function compareFertility(configFile, currentFertility, projectIdIndexFertilizer) {
  minFertility = configFile.fertilityConfigs[projectIdIndexFertilizer].minFertility;
  maxFertility = configFile.fertilityConfigs[projectIdIndexFertilizer].maxFertility;
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
  let index = dataArray.findIndex(function (item, i) {
    return item.projectId === projectId;
  });
  return index;
}