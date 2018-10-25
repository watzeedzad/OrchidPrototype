const mongoose = require("mongoose");
const fs = require("fs");
const tempAutoFertilizeringHistory = mongoose.model("temp_fertilizering_history");
const farm = mongoose.model("farm");
const project = mongoose.model("project");
const fertilizeringHistory = mongoose.model("fertilizer_history");

let tempAutoFertilizeringHistoryResultData;
let allFarmIdResultData;
let isExistHistoryResultData;
let configFile;
let createNewFertilizerHistoryResultStatus;
let updateExistFertilizerHistoryResultStatus;

export default class SummaryAutoFertilizeingHistory {
    constructor() {
        operation();
    }
}

async function operation() {
    console.log("[SummaryAutoFertilizeringHistory] start batch fertilizering history summarize!");
    allFarmIdResultData = await getAllFarmId();
    if (allFarmIdResultData.length == 0) {
        return;
    }
    let allProjectConfig;
    for (let farmIndex = 0; farmIndex < allFarmIdResultData.length; farmIndex++) {
        await getConfigFile(allFarmIdResultData[farmIndex].farmId);
        if (typeof configFile === "undefined") {
            console.log("[SummaryAutoFertilizeringHistory] configFile is undefined!");
            return;
        }
        allProjectConfig = configFile.fertilizer
        for (let projectConfigIndex = 0; projectConfigIndex < allProjectConfig.length; projectConfigIndex++) {
            let projectResultData;
            let projectId = allProjectConfig[projectConfigIndex].projectId;
            let oneProjectTimeRanges = allProjectConfig[projectConfigIndex].timeRanges;
            for (let timeRangesIndex = 0; timeRangesIndex < oneProjectTimeRanges.length; timeRangesIndex++) {
                tempAutoFertilizeringHistoryResultData = await getAllTempAutoFertilizeringHistoryData(
                    allFarmIdResultData[farmIndex].farmId,
                    projectId,
                    oneProjectTimeRanges[timeRangesIndex]
                );
                if (tempAutoFertilizeringHistoryResultData.length == 0) {
                    console.log("[SummaryAutoFertilizeringHistory] no temp data to summarize!");
                }
                projectResultData = await getProjectData(allFarmIdResultData[farmIndex].farmId, projectId);
                if (projectResultData == null) {
                    return;
                }
                isExistHistoryResultData = await isProjectHistoryExist(
                    allFarmIdResultData[farmIndex].farmId,
                    projectResultData.greenHouseId,
                    projectId
                );
                if (isExistHistoryResultData == null) {
                    createNewFertilizerHistoryResultStatus = await createNewFertilizerHistory(
                        allFarmIdResultData[farmIndex].farmId,
                        projectResultData.greenHouseId,
                        projectId,
                        tempAutoFertilizeringHistoryResultData.totalAmount,
                        oneProjectTimeRanges[timeRangesIndex],
                        projectResultData.ratio
                    );
                    if (!createNewFertilizerHistoryResultStatus) {
                        return;
                    }
                } else {
                    updateExistFertilizerHistoryResultStatus = await updateExistFertilizerHistory(
                        allFarmIdResultData[farmIndex].farmId,
                        projectResultData.greenHouseId,
                        projectId,
                        tempAutoFertilizeringHistoryResultData.totalAmount,
                        oneProjectTimeRanges[timeRangesIndex],
                        projectResultData.ratio
                    );
                    if (!updateExistFertilizerHistoryResultStatus) {
                        return;
                    }
                }
            }
        };
        await clearAllTempFertilizeringData(allFarmIdResultData[farmIndex].farmId);
    }
    console.log("[SummaryAutoFertilizeringHistory] end batch fertilizering history summarize!")
}

async function getAllFarmId() {
    let result = await farm.find({}, "farmId", (err, result) => {
        if (err) {
            allFarmIdResultData = null;
            console.log("[SummaryAutoFertilizeringHistory] getAllFarmId (err): " + err);
        } else if (!result) {
            allFarmIdResultData = null;
            console.log("[SummaryAutoFertilizeringHistory] getAllFarmId (!result): " + result);
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
                console.log("[SummaryAutoFertilizeringHistory] getConfigFile (err): " + err);
            } else if (!result) {
                console.log("[SummaryAutoFertilizeringHistory] getConfigFile (!result): " + result);
            } else {
                // console.log("[SummaryAutoFertilizeringHistory] getConfigFile (result): " + result);
            }
        }
    );
    let configFilePath = farmResult.configFilePath;
    let config = JSON.parse(fs.readFileSync(String(configFilePath), "utf8"));
    configFile = config;
}

async function getAllTempAutoFertilizeringHistoryData(farmId, projectId, timeStart) {
    let tempTime = new Date(timeStart);
    let startTime = new Date();
    let endTime = new Date();
    startTime.setHours(tempTime.getHours());
    startTime.setMinutes(tempTime.getMinutes());
    endTime.setHours(tempTime.getHours() + 2);
    endTime.setMinutes(tempTime.getMinutes() + 2);
    console.log(startTime, endTime);
    let result = await tempAutoFertilizeringHistory.aggregate([{
        "$match": {
            farmId: farmId,
            projectId: projectId,
            timeStamp: {
                $gte: startTime,
                $lt: endTime
            }
        }
    }, {
        "$group": {
            _id: "$projectId",
            totalAmount: {
                $sum: "$amount"
            }
        }
    }], function (err, result) {
        if (err) {
            tempAutoFertilizeringHistoryResultData = null;
            console.log("[SummaryAutoFertilizeringHistory] getAllTempAutoFertilizeringHistoryData (err): " + err);
        } else if (!result) {
            tempAutoFertilizeringHistoryResultData = null;
            console.log("[SummaryAutoFertilizeringHistory] getAllTempAutoFertilizeringHistoryData (!result): " + result);
        } else {
            tempAutoFertilizeringHistoryResultData = result;
        }
    });
    console.log(result);
    return result;
}

async function getProjectData(farmId, projectId) {
    let result = await project.findOne({
        farmId: farmId,
        projectId: projectId
    }, function (err, result) {
        if (err) {
            console.log("[SummaryAutoFertilizeringHistory] getProjectData (err): " + err);
            return null;
        } else if (!result) {
            console.log("[SummaryAutoFertilizeringHistory] getProjectData (!result): " + result);
            return null;
        } else {
            return result;
        }
    });
    return result;
}

async function isProjectHistoryExist(farmId, greenHouseId, projectId) {
    let result = await wateringHistory.findOne({
        farmId: farmId,
        greenHouseId: greenHouseId,
        projectId: projectId
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

async function createNewFertilizerHistory(farmId, greenHouseId, projectId, totalAmount, startTime, ratio) {
    let tempDate = new Date(startTime);
    let insertDate = new Date();
    insertDate.setHours(tempDate.getHours());
    insertDate.setMinutes(tempDate.getMinutes());
    let result;
    let newData = {
        farmId: farmId,
        greenHouseId: greenHouseId,
        projectId: projectId,
        history: [{
            volume: totalAmount,
            ratio: ratio,
            startTime: insertDate
        }]
    };
    await fertilizeringHistory(newData).save(function (err) {
        if (err) {
            console.log("[SummaryAutoFertilizeringHistory] createNewFertilizerHistory (err): " + err);
            result = false;
        } else {
            console.log("[SummaryAutoFertilizeringHistory] createNewFertilizerHistory: create new data!")
            result = true;
        }
    });
    return result;
};

async function updateExistFertilizerHistory(farmId, greenHouseId, project, totalAmount, startTime, ratio) {
    let tempDate = new Date(startTime);
    let insertDate = new Date();
    insertDate.setHours(tempDate.getHours());
    insertDate.setMinutes(tempDate.getMinutes());
    let result;
    await wateringHistory.findOneAndUpdate({
        farmId: farmId,
        greenHouseId: greenHouseId,
        projectId: project
    }, {
        "$push": {
            history: {
                volume: totalAmount,
                ratio: ratio,
                startTime: insertDate
            }
        }
    }, function (err) {
        if (err) {
            console.log("[SummaryAutoWateringHistory] updateExistWateringHistory (err): " + err);
            result = false;
        } else {
            console.log("[SummaryAutoWateringHistory] updateExistWateringHistory: update done!")
            result = true;
        }
    });
    return result;
}

async function clearAllTempFertilizeringData(farmId) {
    console.log("[SummaryAutoWateringHistory] clear temp fetilizering data of " + farmId);
    await fertilizeringHistory.remove({
        farmId: farmId
    })
}