import InsertRelayCommand from "../Utils/InsertRelayCommand";

const mongoose = require("mongoose");
const fs = require("fs");
const moment = require("moment");
const farm = mongoose.model("farm");
const know_controller = mongoose.model("know_controller");
const lightDuration = mongoose.model("light_duration");

moment().format();

let configFile;
let controllerDataResult;
let minLightIntensity;
let maxLightIntensity;
let lightDurationResult;
let updateLightDurationResult;
let currentDuration;
let previousDate;

export default class LightCheck {
  constructor(req) {
    operation(req);
  }
}

async function operation(req, res) {
  let greenHouseId = req.body.greenHouseId;
  let farmId = req.body.farmId;
  let ambientLight = req.body.ambientLight;
  let piMacAddress = req.body.piMacAddress;
  if (typeof greenHouseId === "undefined" || typeof farmId === "undefined" || typeof ambientLight === "undefined" || typeof piMacAddress === "undefined") {
    req.session.lightCheckStatus = 500;
    return;
  }
  await getConfigFile(farmId);
  controllerDataResult = await getControllerData(greenHouseId, farmId);
  if (controllerDataResult == null) {
    req.session.lightCheckStatus = 200;
    return;
  }

  let nowLightCheckDate = new Date();
  // if (nowLightCheckDate.getHours() >= 7 && nowLightCheckDate.getHours() <= 18) {
  //   new InsertRelayCommand(controllerDataResult.ip, "light", false, piMacAddress);
  //   isAlreadySetPumptoFalse = true;
  //   console.log("[LightCheck] day light time, turn off the light and enter check function");
  // } else {
  //   console.log("[LightCheck] night time, enter check function");
  // }

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
  }
  console.log("[LightCheck] resultCompareLightIntensity: " + resultCompareLightIntensity);

  await getLastestLightDurationData(farmId, greenHouseId, function (result) {
    lightDurationResult = result;
    if (lightDurationResult == null) {
      createNewLightDuration(farmId, greenHouseId, nowLightCheckDate, function (createLightDurationResult) {
        if (createLightDurationResult) {
          req.session.lightCheckStatus = 200;
        } else {
          req.session.lightCheckStatus = 500;
        }
        return;
      });
    } else {
      if (nowLightCheckDate.getHours() >= 7 && nowLightCheckDate.getHours() <= 17) {
        if (currentDuration >= configFile.lightVolumeConfigs[greenHouseIndexLightIntensity].maxLightVolume) {
          new InsertRelayCommand(controllerDataResult.ip, "light", false, piMacAddress);
          console.log("[LightCheck] enough light in day time");
          req.session.lightCheckStatus = 200;
          return;
        }
      }
    }
  });
  currentDuration = lightDurationResult.duration;
  previousDate = new Date(lightDurationResult.timeStamp);
  if (nowLightCheckDate.getHours() >= 7 && nowLightCheckDate.getHours() <= 17) {
    if (!resultCompareLightIntensity) {
      new InsertRelayCommand(controllerDataResult.ip, "light", true, piMacAddress);
      console.log("[LightCheck] in day light time, light intensity and volume not met criteria");
    } else {
      new InsertRelayCommand(controllerDataResult.ip, "light", false, piMacAddress);
      console.log("[LightCheck] in day light time, light volume not met criteria but light intensity met criteria");
    }
    if (resultCompareLightIntensity) {
      currentDuration += nowLightCheckDate.getTime() - previousDate.getTime();
      console.log("[LightCheck] currentDuration (update): " + currentDuration);
      await updateLightDurationData(lightDurationResult._id, currentDuration, nowLightCheckDate, true, function (updateLightDuration) {
        updateLightDurationResult = updateLightDuration;
      });
    } else {
      console.log("[LightCheck] currentDuration (not update): " + currentDuration);
      await updateLightDurationData(lightDurationResult._id, null, nowLightCheckDate, false, function (updateLightDuration) {
        updateLightDurationResult = updateLightDuration;
      });
    }
    req.session.lightCheckStatus = 200;
    return;
  } else {
    console.log("[LightCheck] in night time not check duration");
    await updateLightDurationData(lightDurationResult._id, null, nowLightCheckDate, false, function (updateLightDuration) {
      updateLightDurationResult = updateLightDuration;
    });
    new InsertRelayCommand(controllerDataResult.ip, "light", false, piMacAddress);

    if (currentDuration != 0) {
      nowLightCheckDate.setHours(0);
      nowLightCheckDate.setMinutes(0);
      nowLightCheckDate.setSeconds(0);
      nowLightCheckDate.setMilliseconds(0);
      previousDate.setHours(0);
      previousDate.setMinutes(0);
      previousDate.setSeconds(0);
      previousDate.setMilliseconds(0);
      let momentNowLightCheckDate = moment(nowLightCheckDate);
      let momentPreviousDate = moment(previousDate);
      console.log("[LightCheck] moment isBefore check: " + moment(momentPreviousDate).isBefore(momentNowLightCheckDate), momentNowLightCheckDate, momentPreviousDate);
      if (moment(momentPreviousDate).isBefore(momentNowLightCheckDate)) {
        console.log("[LightCheck] enter duration reset");
        await resetDurationTime(lightDurationResult._id, function (resetLightDurationResult) {
          if (resetLightDurationResult) {
            req.session.lightCheckStatus = 200;
          } else {
            req.session.lightCheckStatus = 500;
          }
          return;
        });
      }
    }
  }

  // if (!(nowLightCheckDate.getHours() >= 7 && nowLightCheckDate.getHours() <= 17) && (configFile.lightVolumeConfigs[greenHouseIndexLightIntensity].maxLightVolume > currentDuration)) {
  //   console.log("[LightCheck] turn on light condition: " + !(nowLightCheckDate.getHours() >= 7 && nowLightCheckDate.getHours() <= 17), (configFile.lightVolumeConfigs[greenHouseIndexLightIntensity].maxLightVolume > currentDuration));
  //   console.log("[LightCheck] turn on light params: " + configFile.lightVolumeConfigs[greenHouseIndexLightIntensity].maxLightVolume, currentDuration);
  //   new InsertRelayCommand(controllerDataResult.ip, "light", true, piMacAddress);
  // } else {
  //   if (!isAlreadySetPumptoFalse) {
  //     new InsertRelayCommand(controllerDataResult.ip, "light", false, piMacAddress);
  //   }
  //   console.log("[LightCheck] not in lighting time (night) and enough light");
  // }

  if (updateLightDurationResult) {
    req.session.lightCheckStatus = 200;
    return;
  } else {
    req.session.lightCheckStatus = 500;
    return;
  }
}

async function getControllerData(greenHouseId, farmId) {
  let result = await know_controller.findOne({
      isHaveRelay: true,
      "relayType.light": true,
      greenHouseId: greenHouseId,
      farmId: farmId
    },
    function (err, result) {
      if (err) {
        controllerDataResult = null;
        console.log("[LightCheck] getControllerData (err): " + err);
      } else if (!result) {
        controllerDataResult = null;
        console.log("[LightCheck] getControllerData (!result): " + result);
      } else {
        controllerDataResult = result;
      }
    }
  );
  return result;
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
        // console.log("[LightCheck] getConfigFile (result): " + result);
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
  } else if (currentLightIntensity >= minLightIntensity) {
    return true;
  } else {
    return false;
  }
}

function seekGreenHouseIdIndex(dataArray, greenHouseId) {
  // console.log(dataArray);
  let index = dataArray.findIndex(function (item) {
    return item.greenHouseId === greenHouseId;
  });
  return index;
}

async function getLastestLightDurationData(farmId, greenHouseId, callback) {
  await lightDuration.findOne({
      farmId: farmId,
      greenHouseId: greenHouseId
    },
    function (err, result) {
      if (err) {
        result = null;
        console.log("[LightCheck] getLastestLightDurationData (err): " + err);
      } else if (!result) {
        result = null;
        console.log("[LightCheck] getLastestLightDurationData (!result): " + result);
      }
      callback(result);
    }
  );
}

async function updateLightDurationData(id, updateDuration, nowLightCheckDate, isUpdateDuration, callback) {
  let updateLightDurationResult;

  if (isUpdateDuration) {
    console.log("[LightCheck] updateLightDurationData (update duration and timestamp)");
    await lightDuration.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        duration: updateDuration,
        timeStamp: nowLightCheckDate
      }
    }, (err, doc) => {
      if (err) {
        updateLightDurationResult = false;
      } else if (!doc) {
        updateLightDurationResult = false;
      } else {
        updateLightDurationResult = true;
      }
      callback(updateLightDurationResult);
    });
  } else {
    console.log("[LightCheck] updateLightDurationData (update timestamp)");
    await lightDuration.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        timeStamp: nowLightCheckDate
      }
    }, (err, doc) => {
      if (err) {
        updateLightDurationResult = false;
      } else if (!doc) {
        updateLightDurationResult = false;
      } else {
        updateLightDurationResult = true;
      }
      callback(updateLightDurationResult);
    })
  }
}

async function createNewLightDuration(farmId, greenHouseId, nowDate, callback) {
  let createNewLightDurationResult = null;

  let newdata = {
    farmId: farmId,
    greenHouseId: greenHouseId,
    duration: 0,
    timeStamp: nowDate
  }
  await new lightDuration(newdata).save(function (err) {
    if (!err) {
      createNewLightDurationResult = false;
      console.log("[LightCheck] create new duration data")
    } else {
      createNewLightDurationResult = true;
      console.log(err)
    }
    callback(createNewLightDurationResult);
  });
}

async function resetDurationTime(id, callback) {
  let resetDurationTimeResult = null;

  await lightDuration.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      duration: 0
    }
  }, (err, doc) => {
    if (err) {
      resetDurationTimeResult = false;
    } else if (!doc) {
      resetDurationTimeResult = false;
    } else {
      resetDurationTimeResult = true;
    }
    callback(resetDurationTimeResult);
  })
}