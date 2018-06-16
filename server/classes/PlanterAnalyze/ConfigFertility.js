const fs = require("fs");

let configFile;

export default class ConfigFertility {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    await getConfigFile();
    if (typeof configFile === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดไม่สามารถอ่านไฟล์การตั้งค่าได้"
      });
      return;
    }
    if (typeof req.body.minFertility === "undefined" || typeof req.body.maxFertility == "undefined" || typeof req.body.projectId === "undefined") {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าความอุดมสมบูรณ์ในเครื่องปลูก"
      });
      return;
    }
    let minConfigFertility = parseFloat(req.body.minFertility);
    console.log("[ConfigFertility] minConfigFertility: " + minConfigFertility);
    let maxConfigFertility = parseFloat(req.body.maxFertility);
    console.log("[ConfgiFertility] maxConfigFertility: " + maxConfigFertility);
    let projectId = req.body.projectId;
    console.log("[ConfigFertility] projectId: " + projectId);
    let projectConfigIndex = await seekProjectIdIndex(
      configFile.fertilityConfigs,
      projectId
    );
    if (projectConfigIndex == -1) {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดในการตั้งค่าความอุดมสมบูรณ์ในเครื่องปลูก"
      });
    }
    if (minConfigFertility > maxConfigFertility) {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดไม่สามารถเขียนไฟล์การตั้งค่าได้"
      });
      return;
    }
    let updateData = {
      projectId: projectId,
      minFertility: minConfigFertility,
      maxFertility: maxConfigFertility
    };
    configFile.fertilityConfigs[projectConfigIndex] = updateData;
    await writeConfigFile(configFile, res)
  }
}

function getConfigFile() {
  console.log("[ConfigFertility] getConfigFilePath: " + pathGlobal);
  let config = JSON.parse(
    require("fs").readFileSync(String(pathGlobal), "utf8")
  );
  configFile = config;
}

function writeConfigFile(configFile, res) {
  let writeFileResult;
  let content = JSON.stringify(configFile);
  fs.writeFile(String(pathGlobal), content, "utf8", function (err) {
    if (err) {
      console.log(err);
      writeFileResult = false;
    }
    writeFileResult = true;
    console.log("[ConfigFertility] write file with no error");
    if (writeFileResult) {
      res.sendStatus(200);
    } else {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดไม่สามารถเขียนไฟล์การตั้งค่าได้"
      });
    }
  });
}

function seekProjectIdIndex(dataArray, projectId) {
  let index = dataArray.findIndex(function (item, i) {
    return item.projectId === projectId;
  });
  return index;
}