const fs = require("fs");

let configFile;

export default class ConfigFertility {
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
    let minConfigFertility = parseFloat(req.body.minFertility);
    let maxConfigFertility = parseFloat(req.body.maxFertility);
    let projectId = parseInt(req.body.projectId);
    let projectConfigIndex = await seekProjectIdIndex(
      configFile.fertilityConfigs,
      projectId
    );
    async function writeFile() {
      await writeConfigFile(configFile);
      res.sendStatus(200);
    }
    if (minConfigFertility > maxConfigFertility) {
      res.sendStatus(500);
    } else {
      let updateData = {
        projectId: projectId,
        minFertility: minConfigFertility,
        maxFertility: maxConfigFertility
      };
      configFile.fertilityConfigs[projectConfigIndex] = updateData;
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

function seekProjectIdIndex(dataArray, projectId) {
  console.log(dataArray);
  let index = dataArray.findIndex(function(item, i) {
    return item.projectId === projectId;
  });
  if (index == -1) {
    return dataArray.length;
  } else {
    return index;
  }
}
