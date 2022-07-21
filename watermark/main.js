const cachéFolder = process.env.CACHÉ_FOLDER;
var path = require("path");
var folder = path.join(__dirname, "../../", process.env.SAVED_FOLDER);
const exFolder = process.env.EXAMPLE_FOLDER;
const caché = require("../asset/caché");
const fUtil = require("../misc/file");
const nodezip = require("node-zip");
const parse = require("../movie/parse");
const util = require("../misc/util");
const fs = require("fs");

module.exports = {
	save(mId, wId) {
		var pth = path.join(folder, `${mId}.xml`);
		var wXml;
		if (wId == "0dhteqDBt5nY") {
			wXml = '<watermarks><watermark style="visualplugin"/></watermarks>';
		} else {
			wXml = '<watermarks></watermarks>';
		}
		fs.writeFileSync(pth, wXml);
	},
	meta(movieId) {
		return new Promise(async (res, rej) => {
			const buffer = fs.readFileSync(path.join(folder, `${movieId}.xml`));

			const fd = fs.openSync(buffer, "r");
			fs.readSync(fd, buffer, 0, 256, 0);

			fs.closeSync(fd);
			res({
				date: fs.statSync(fn).mtime,
				id: movieId,
			});
		});
	},
};
