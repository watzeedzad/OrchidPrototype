const fs = require("fs");

let configFile;

export default class ConfigHumidity {
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
    let minConfigHumid = parseFloat(req.body.minHumidity);
    console.log("minConfigJumid: " + minConfigHumid);
    let maxConfigHumid = parseFloat(req.body.maxHumidity);
    console.log("maxConfigHumid: " + maxConfigHumid);
    async function writeFile() {
      await writeConfigFile(configFile);
      res.sendStatus(200);
    }
    if (
      typeof minConfigHumid === "undefined" ||
      typeof maxConfigHumid === "undefined"
    ) {
      res.sendStatus(500);
    } else if (minConfigHumid > maxConfigHumid) {
      res.sendStatus(500);
    } else {
      configFile.minHumidity = minConfigHumid;
      configFile.maxHumidity = maxConfigHumid;
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
