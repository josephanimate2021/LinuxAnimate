const cachéFolder = process.env.CACHÉ_FOLDER;
const folder = process.env.SAVED_FOLDER;
const exFolder = process.env.EXAMPLE_FOLDER;
const caché = require("../asset/caché");
const fUtil = require("../misc/file");
const nodezip = require("node-zip");
const parse = require("../movie/parse");
const util = require("../misc/util");
const fs = require("fs");

module.exports = {
	save(mId, wId) {
		var path = `${folder}/${mId}.xml`;
		var wXml;
		if (wId == "0dhteqDBt5nY") {
			wXml = '<watermarks><watermark style="visualplugin"/></watermarks>';
		} else {
			wXml = '<watermarks></watermarks>';
		}
		fs.writeFileSync(path, wXml);
	},
	meta(movieId) {
		return new Promise(async (res, rej) => {
			const fn = `${folder}/${movieId}.xml`;

			const fd = fs.openSync(fn, "r");
			const buffer = Buffer.alloc(256);
			fs.readSync(fd, buffer, 0, 256, 0);

			fs.closeSync(fd);
			res({
				date: fs.statSync(fn).mtime,
				id: movieId,
			});
		});
	},
};
