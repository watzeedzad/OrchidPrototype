import InsertRelayCommand from "../Utils/InsertRelayCommand";

const mongoose = require("mongoose");
const fs = require("fs");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");
const lightDuration = mongoose.model("light_duration");

let configFile;
let controllerDataResult;
let minLightIntensity;
let maxLightIntensity;
let lightDurationResult;
let updateLightDurationResult;

export default class LightCheck {
  constructor(req) {
    this.operation(req);
  }

  async operation(req) {
    let greenHouseId = req.body.greenHouseId;
    let farmId = req.body.farmId;
    let ambientLight = req.body.ambientLight;
    let piMacAddress = req.body.piMacAddress;
    if (typeof greenHouseId === "undefined" || typeof farmId === "undefined" || typeof ambientLight === "undefined" || typeof piMacAddress === "undefined") {
      req.session.lightCheckStatus = 500;
      return;
    }
    await getConfigFile(farmId);
    await getControllerData(greenHouseId, farmId);
    if (typeof controllerDataResult === "undefined") {
      req.session.lightCheckStatus = 200;
      return;
    }
    let nowLightCheckDate = new Date();
    if (nowLightCheckDate.getHours() < 7 && nowLightCheckDate.getHours() > 18) {
      return;
    } else {
      new InsertRelayCommand(controllerDataResult.ip, "light", false, piMacAddress);
      // console.log("[LightCheck] farmDataResult.piMacAddress: " + farmDataResult.piMacAddress);
    }
    let greenHouseIndexLightIntensity = await seekGreenHouseIdIndex(
      configFile.lightIntensityConfigs,
      greenHouseId
    );
    console.log(
      "[LightCheck] greenHouseIndexLightIntensity: " +
      greenHouseIndexLightIntensity
    );
    if (greenHouseIndexLightIntensity == -1) {
      req.session.lightCheckStatus = 500;
      return;
    }
    let resultCompareLightIntensity = await compareLightIntensity(
      configFile,
      ambientLight,
      greenHouseIndexLightIntensity
    );
    if (typeof resultCompareLightIntensity === "undefined") {
      req.session.lightCheckStatus = 500;
      return;
    } else {
      if (!resultCompareLightIntensity) {
        new InsertRelayCommand(
          controllerDataResult.ip,
          "light",
          true,
          piMacAddress
        );
      } else {
        new InsertRelayCommand(
          controllerDataResult.ip,
          "light",
          false,
          piMacAddress
        );
      }
      await getLastestLightDurationData(farmResultId, greenHouseId);
      let currentDuration;
      if (lightDurationResult.lastestResult) {
        let previousDate = new Date(lightDurationResult.timeStamp);
        let nowDate = new Date();
        previousDate = previousDate.getTime();
        nowDate = nowDate.getTime();
        let updateTimeDuration =
          (nowDate = previousDate) + lightDurationResult.duration;
        currentDuration = updateTimeDuration;
        await updateLightDurationData(
          lightDurationResult._id,
          lightDurationResult.farmId,
          lightDurationResult.greenHouseId,
          updateTimeDuration,
          resultCompareLightIntensity
        );
      } else {
        currentDuration = lightDurationResult.duration;
        await updateLightDurationData(
          lightDurationResult._id,
          lightDurationResult.farmId,
          lightDurationResult.greenHouseId,
          lightDurationResult.duration,
          resultCompareLightIntensity
        );
      }
      if (typeof updateLightDurationResult === "undefined") {
        req.session.lightCheckStatus = 500;
        return;
      } else {
        req.session.lightCheckStatus = 200;
        return;
      }
    }
    if (nowLightCheckDate.getHours() > 7 && nowLightCheckDate.getHours() < 18 && !resultCompareLightIntensity && (configFile.lightVolumeConfigs[greenHouseIndexLightIntensity] > currentDuration)) {
      new InsertRelayCommand(controllerDataResult.ip, "light", true, piMacAddress);
      // console.log("[LightCheck] farmDataResult.piMacAddress: " + farmDataResult.piMacAddress);
    }
  }
}

async function getControllerData(greenHouseId, farmId) {
  console.log("[LightCheck] getControllerData, greenHouseId: " + greenHouseId);
  console.log("[LightCheck] getControllerData, farmid: " + farmId);
  await know_controller.findOne({
      isHaveRelay: true,
      "relayType.light": true,
      greenHouseId: greenHouseId,
      farmId: farmId
    },
    function (err, result) {
      if (err) {
        controllerDataResult = undefined;
        console.log("[LightCheck] getControllerData (err): " + err);
      } else if (!result) {
        controllerDataResult = undefined;
        console.log("[LightCheck] getControllerData (!result): " + result);
      } else {
        controllerDataResult = result;
      }
    }
  );
}

async function getConfigFile(farmIdIn) {
  let farmData = await farm.findOne({
      farmId: farmIdIn
    },
    function (err, result) {
      if (err) {
        console.log("[LightCheck] getConfigFile (err): " + err);
      } else if (!result) {
        console.log("[LightCheck] getConfigFile (!result): " + result);
      } else {
        console.log("[LightCheck] getConfigFile (result): " + result);
      }
    }
  );
  let configFilePath = farmData.configFilePath;
  let config = JSON.parse(fs.readFileSync(String(configFilePath), "utf8"));
  configFile = config;
}

function compareLightIntensity(
  configFile,
  currentLightIntensity,
  greenHouseIdIndex
) {
  minLightIntensity =
    configFile.lightIntensityConfigs[greenHouseIdIndex].minLightIntensity;
  maxLightIntensity =
    configFile.lightIntensityConfigs[greenHouseIdIndex].maxLightIntensity;
  console.log("[LightCheck] MIN-LI: " + minLightIntensity);
  console.log("[LightCheck] MAX-LI: " + maxLightIntensity);
  if (minLightIntensity == null || maxLightIntensity == null) {
    return undefined;
  } else if (currentLightIntensity > minLightIntensity) {
    return false;
  } else if (currentLightIntensity < maxLightIntensity) {
    return true;
  }
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
  // console.log(dataArray);
  let index = dataArray.findIndex(function (item) {
    return item.greenHouseId === greenHouseId;
  });
  return index;
}

async function getLastestLightDurationData(farmId, greenHouseId) {
  await lightDuration.findOne({
      farmId: farmId,
      greenHouseId: greenHouseId
    },
    function (err, result) {
      if (err) {
        console.log("[LightCheck] getLastestLightDurationData (err): " + err);
      } else if (!result) {
        console.log(
          "[LightCheck] getLastestLightDurationData (!result): " + result
        );
      } else {
        lightDurationResult = result;
      }
    }
  );
}

function updateLightDurationData(
  id,
  farmId,
  greenHouseId,
  updateDuration,
  lastestResult
) {
  let updateData = {
    farmId: farmId,
    greenHouseId: greenHouseId,
    duration: updateDuration,
    lastestResult: lastestResult,
    timeStamp: new Date()
  };

  lightDuration.findByIdAndUpdate(id, updateData, {
    new: true
  }, function (
    err,
    result
  ) {
    if (err) {
      console.log("[LightCheck] updateLightDurationData (err): " + err);
      updateLightDurationResult = undefined;
    } else if (!result) {
      console.log("[LightCheck] updateLightDurationData (!result): " + result);
      updateLightDurationResult = undefined;
    } else {
      updateLightDurationResult = result;
    }
  });
}