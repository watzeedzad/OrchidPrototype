const mongoose = require("mongoose");
const fs = require("fs");
const tempAutoWateringHistory = mongoose.model("temp_watering_history");
const farm = mongoose.model("farm");
const wateringHistory = mongoose.model("water_history");

let tempAutoWateringHistoryResultData;
let isExistHistoryResultData;
let allFarmIdResultData;
let configFile;

export default class SummaryAutoWateringHistory {
    constructor() {
        operation();
    }
}

async function operation() {
    console.log("[SummaryAutoWateringHistory] start batch watering history summarize!");
    allFarmIdResultData = await getAllFarmId();
    if (allFarmIdResultData.length == 0) {
        return;
    }
    let allGreenHouseConfig;
    for (let farmIndex = 0; farmIndex < allFarmIdResultData.length; farmIndex++) {
        console.log("[SummaryAutoWateringHistory] farmLoop length: " + allFarmIdResultData.length);
        console.log("[SummaryAutoWateringHistory] farmLoop (farmIndex): " + farmIndex);
        await getConfigFile(allFarmIdResultData[farmIndex].farmId);
        if (typeof configFile === "undefined") {
            console.log("[SummaryAutoWateringHistory] configFile is undefined!");
            return;
        }
        allGreenHouseConfig = configFile.watering;
        if (typeof allGreenHouseConfig === "undefined") {
            continue;
        }
        for (let greenHouseConfigIndex = 0; greenHouseConfigIndex < allGreenHouseConfig.length; greenHouseConfigIndex++) {
            console.log("[SummaryAutoWateringHistory] greenHouseConfigLoop length: " + allGreenHouseConfig.length);
            console.log("[SummaryAutoWateringHistory] greenHouseConfigLoop (greenHouseConfigIndex, farmIndex): " + greenHouseConfigIndex, farmIndex);
            let greenHouseId = allGreenHouseConfig[greenHouseConfigIndex].greenHouseId
            let oneGreenHouseTimeRanges = allGreenHouseConfig[greenHouseConfigIndex].timeRanges
            for (let timeRangesIndex = 0; timeRangesIndex < oneGreenHouseTimeRanges.length; timeRangesIndex++) {
                console.log("[SummaryAutoWateringHistory] timeRangesLoop length: " + oneGreenHouseTimeRanges.length);
                console.log("[SummaryAutoWateringHistory] timeRangesLoop (timeRangesIndex, greenHouseConfigIndex, farmIndex): " + timeRangesIndex, greenHouseConfigIndex, farmIndex);
                tempAutoWateringHistoryResultData = await getAllTempAutoWateringHistoryData(
                    allFarmIdResultData[farmIndex].farmId,
                    greenHouseId,
                    oneGreenHouseTimeRanges[timeRangesIndex]
                );
                if (tempAutoWateringHistoryResultData.length == 0) {
                    console.log("[SummaryAutoWateringHistory] no temp data to summrize!");
                    continue;
                }
                isExistHistoryResultData = await isGreenHouseHistoryExist(allFarmIdResultData[farmIndex].farmId, greenHouseId);
                if (isExistHistoryResultData == null) {
                    await createNewWaterHistory(
                        allFarmIdResultData[farmIndex].farmId,
                        greenHouseId,
                        tempAutoWateringHistoryResultData[0].totalAmount,
                        oneGreenHouseTimeRanges[timeRangesIndex],
                        function (result) {
                            if (!result) {
                                return;
                            }
                        }
                    );
                } else {
                    await updateExistWaterHistory(
                        allFarmIdResultData[farmIndex].farmId,
                        greenHouseId,
                        tempAutoWateringHistoryResultData[0].totalAmount,
                        oneGreenHouseTimeRanges[timeRangesIndex],
                        function (result) {
                            if (!result) {
                                return;
                            }
                        }
                    );
                }
            }
        }
        console.log("[SummaryAutoWateringHistory] calling clear data of farmId : " + allFarmIdResultData[farmIndex].farmId);
        await clearAllTempWateringData(allFarmIdResultData[farmIndex].farmId);
    }
    console.log("[SummaryAutoWateringHistory] end batch watering history summarize!");
}

async function getAllTempAutoWateringHistoryData(farmId, greenHouseId, timeStart) {
    let tempTime = new Date(timeStart);
    let startTime = new Date();
    let endTime = new Date();
    startTime.setHours(tempTime.getHours());
    startTime.setMinutes(tempTime.getMinutes() - 1);
    endTime.setHours(tempTime.getHours() + 2);
    endTime.setMinutes(tempTime.getMinutes() + 2);
    console.log("[SummaryAutoWateringHistory] getAllTempAutoWateringHistoryData: " + farmId, greenHouseId, startTime, endTime);
    let result = tempAutoWateringHistory.aggregate([{
        "$match": {
            farmId: farmId,
            greenHouseId: greenHouseId,
            timeStamp: {
                $gt: startTime,
                $lt: endTime
            }
        }
    }, {
        "$group": {
            _id: "$greenHouseId",
            totalAmount: {
                $sum: "$amount"
            }
        }
    }], function (err, result) {
        if (err) {
            tempAutoWateringHistoryResultData = null;
            console.log("[SummaryAutoWateringHistory] getAllTempAutoWateringHistoryData (err): " + err);
        } else if (!result) {
            tempAutoWateringHistoryResultData = null;
            console.log("[SummaryAutoWateringHistory] getAllTempAutoWateringHistoryData (!result): " + result);
        } else {
            tempAutoWateringHistoryResultData = result;
        }
    });
    return result;
}

async function isGreenHouseHistoryExist(farmId, greenHouseId) {
    let result = await wateringHistory.findOne({
        farmId: farmId,
        greenHouseId: greenHouseId
    }, function (err, result) {
        if (err) {
            isExistHistoryResultData = null;
            console.log("[SummaryAutoWateringHistory] isGreenHouseHistoryExist (err): " + err);
        } else if (!result) {
            isExistHistoryResultData = null;
            console.log("[SummarayAutoWateringHistory] isGteenHouseHistoryExist (!result): " + result);
        } else {
            isExistHistoryResultData = result;
        }
    });
    return result;
}

async function createNewWaterHistory(farmId, greenHouseId, totalAmount, startTime, callback) {
    let tempDate = new Date(startTime);
    let insertDate = new Date();
    insertDate.setHours(tempDate.getHours());
    insertDate.setMinutes(tempDate.getMinutes());
    let result;
    let newData = {
        farmId: farmId,
        greenHouseId: greenHouseId,
        history: [{
            volume: totalAmount,
            startTime: insertDate
        }]
    };
    await wateringHistory(newData).save(function (err) {
        if (err) {
            console.log("[SummaryAutoWateringHistory] createNewWaterHistory (err): " + err);
            result = false;
        } else {
            console.log("[SummaryAutoWateringHistory] createNewWaterHistory: create new data!")
            result = true;
        }
        callback(result);
    });
};

async function updateExistWaterHistory(farmId, greenHouseId, totalAmount, startTime, callback) {
    let tempDate = new Date(startTime);
    let insertDate = new Date();
    insertDate.setHours(tempDate.getHours());
    insertDate.setMinutes(tempDate.getMinutes());
    let result;
    wateringHistory.findOneAndUpdate({
        farmId: farmId,
        greenHouseId: greenHouseId
    }, {
        "$push": {
            history: {
                volume: totalAmount,
                startTime: insertDate
            }
        }
    }, {
        upsert: true,
        new: true
    }, function (err) {
        if (err) {
            console.log("[SummaryAutoWateringHistory] updateExistWateringHistory (err): " + err);
            result = false;
        } else {
            console.log("[SummaryAutoWateringHistory] updateExistWateringHistory: update done!")
            result = true;
        }
        callback(result);
    });
}

async function getAllFarmId() {
    let result = await farm.find({}, "farmId", (err, result) => {
        if (err) {
            allFarmIdResultData = null;
            console.log("[SummaryAutoWateringHistory] getAllFarmId (err): " + err);
        } else if (!result) {
            allFarmIdResultData = null;
            console.log("[SummaryAutoWateringHistory] getAllFarmId (!result): " + result);
        } else {
            allFarmIdResultData = result;
        }
    });
    return result;
}

async function getConfigFile(farmId) {
    let farmResult = await farm.findOne({
            farmId: farmId
        },
        function (err, result) {
            if (err) {
                console.log("[SummaryAutoWateringHistory] getConfigFile (err): " + err);
            } else if (!result) {
                console.log("[SummaryAutoWateringHistory] getConfigFile (!result): " + result);
            } else {
                // console.log("[SummaryAutoWateringHistory] getConfigFile (result): " + result);
            }
        }
    );
    let configFilePath = farmResult.configFilePath;
    let config = JSON.parse(fs.readFileSync(String(configFilePath), "utf8"));
    configFile = config;
}

async function clearAllTempWateringData(farmId) {
    await tempAutoWateringHistory.remove({
        farmId: farmId
    });
}