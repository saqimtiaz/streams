let fs = require('fs');
let path =require('path');
const VERSION = process.env.npm_package_version;
const pluginPath = process.env["npm_package_config_plugin-path"];
//console.log(process.env);
//const pluginInfo = "plugins/streams/plugin.info";
const pluginInfoPath = path.join(process.env.PWD,pluginPath,"plugin.info");  //__dirname

let jsonFileObject = JSON.parse(fs.readFileSync(pluginInfoPath));
jsonFileObject.version = VERSION;
fs.writeFileSync(pluginInfoPath,JSON.stringify(jsonFileObject,null,4));

//Again, scripts should explicitly add generated files to the commit using git add.
