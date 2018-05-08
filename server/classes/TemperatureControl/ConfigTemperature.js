const fs = require("fs");

let configFile;

export default class ConfigTemperature {
  constructor(req, res) {
    this.process(req, res);
  }

  async process(req, res) {
    if (pathGlobal == null) {
      res.sendStatus(500);
    }
    await getConfigFile();
    if (typeof configFile === "undefined") {
      res.sendStatus(500);
    }
    let minConfigTemp = parseFloat(req.body.minTemperature);
    console.log("minConfigTemp: " + minConfigTemp);
    let maxConfigTemp = parseFloat(req.body.maxTemperature);
    console.log("maxConfigTemp: " + maxConfigTemp);
    async function writeFile() {
      await writeConfigFile(configFile);
      res.sendStatus(200);
    }
    if (minConfigTemp > maxConfigTemp) {
      res.sendStatus(500);
    } else {
      configFile.minTemperature = minConfigTemp;
      configFile.maxTemperature = maxConfigTemp;
      writeFile();
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
  fs.writeFileSync(String(pathGlobal), content, "utf8", function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("write with no error");
    }
  });
}
