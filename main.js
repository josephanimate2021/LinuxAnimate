// initialization
function server() {
  require("./server");
}

// vars
const fs = require("fs");
const env = Object.assign(process.env, require("./env"), require("./config"));

// folders
const forms = env.WAVEFORMS_FOLDER;
const asset = env.PROPS_FOLDER;
const cache = env.CACHÉ_FOLDER;
const saved = env.SAVED_FOLDER;

// create directories if they're missing
if (!fs.existsSync(asset)) fs.mkdirSync(asset);
if (!fs.existsSync(cache)) fs.mkdirSync(cache);
if (!fs.existsSync(saved)) fs.mkdirSync(saved);
if (!fs.existsSync(forms)) fs.mkdirSync(forms);

// start server
server();
