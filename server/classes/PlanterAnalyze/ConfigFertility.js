const fs = require("fs");

let configFile;
let writeFilStatus;

export default class ConfigFertility {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    if (typeof req.session.farmData === "undefined" || typeof req.session.configFilePath === "undefined") {
      res.sendStatus(500);
      return;
    }
    console.log("[ConfigFertility] session id: " + req.session.id);
    // req.session.reload(function (err) {
    //   console.log("[ConfigFertility] " + err);
    // });
    // await getConfigFile(req);
    configFile = req.session.configFile;
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
    await writeConfigFile(configFile, req.session.configFilePath);
    if (writeFilStatus) {
      res.sendStatus(200);
    } else {
      res.json({
        status: 500,
        errorMessage: "เกิดข้อผิดพลาดไม่สามารถเขียนไฟล์การตั้งค่าได้"
      });
    }
  }
}

// function getConfigFile(req) {
//   console.log("[ConfigFertility] getConfigFilePath: " + req.session.configFilePath);
//   let config = JSON.parse(
//     require("fs").readFileSync(String(req.session.configFilePath), "utf8")
//   );
//   configFile = config;
// }

function writeConfigFile(configFile, configFilePath) {
  let content = JSON.stringify(configFile);
  fs.writeFile(String(configFilePath), content, "utf8", function (err) {
    if (err) {
      console.log(err);
      writeFileStatus = false;
      return;
    }
  });
  writeFileStatus = true;
  console.log("[ConfigFertility] write file with no error");
}

function seekProjectIdIndex(dataArray, projectId) {
  let index = dataArray.findIndex(function (item, i) {
    return item.projectId === projectId;
  });
  return index;
}