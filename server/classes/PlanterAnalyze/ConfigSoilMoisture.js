const fs = require("fs");

let configFile;

export default class ConfigSoilMoisture {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    if (pathGlobal == null) {
      res.json({
        status: 500,
        message: "เกิดข้อผิดพลาดไม่ได้ login"
      });
    } else {
      await getConfigFile();
      if (typeof configFile === "undefined") {
        res.sendStatus(500);
      }
      let maxConfigSoilMois = parseFloat(req.body.maxSoilMoisture);
      console.log("maxConfigSoilMois: " + maxConfigSoilMois);
      let minConfigSoilMois = parseFloat(req.body.minSoilMoisture);
      console.log("minConfigSoilMois: " + minConfigSoilMois);
      async function writeFile() {
        await writeConfigFile(configFile);
        res.sendStatus(200);
      }
      if (minConfigSoilMois > maxConfigSoilMois) {
        res.sendStatus(500);
      } else {
        configFile.minSoilMoisture = minConfigSoilMois;
        configFile.maxSoilMoisture = maxConfigSoilMois;
        writeFile();
      }
    }
  }
}

async function getConfigFile() {
  console.log("getConfigFilePath: " + pathGlobal);
  let config = JSON.parse(
    require("fs").readFileSync(String(pathGlobal), "utf8")
  );
  configFile = config;
}

async function writeConfigFile(configFile) {
  let content = JSON.stringify(configFile);
  fs.writeFileSync(String(pathGlobal), content, "utf8", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("write with no error");
    }
  });
}