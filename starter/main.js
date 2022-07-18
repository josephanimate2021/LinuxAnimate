const cachéFolder = process.env.CACHÉ_FOLDER;
const exFolder = process.env.EXAMPLE_FOLDER;
const caché = require("../asset/caché");
const fUtil = require("../misc/file");
const nodezip = require("node-zip");
const parse = require("../movie/parse");
const util = require("../misc/util");
const fs = require("fs");

module.exports = {
	save(starterZip, thumb) {
		return new Promise(async (res, rej) => {
                var zip = nodezip.unzip(starterZip);
                var id = fUtil.getNextFileId("starter-", ".xml");
                const thumbFile = fUtil.getFileIndex("starter-", ".png", id);
                fs.writeFileSync(thumbFile, thumb);
                var path = fUtil.getFileIndex("starter-", ".xml", id);
                var writeStream = fs.createWriteStream(path);
                var assetBuffers = caché.loadTable("s-" + id);
                parse.unpackMovie(zip, thumb, assetBuffers).then((data) => {
                    writeStream.write(data, () => {
                        writeStream.close();
                        res("s-" + id);
                    });
                });
            });
	},
	meta(movieId) {
		return new Promise(async (res, rej) => {
			if (!movieId.startsWith("s-")) return;
			const n = Number.parseInt(movieId.substr(2));
			const fn = fUtil.getFileIndex("starter-", ".xml", n);

			const fd = fs.openSync(fn, "r");
			const buffer = Buffer.alloc(256);
			fs.readSync(fd, buffer, 0, 256, 0);
			const begTitle = buffer.indexOf("<title>") + 16;
			const endTitle = buffer.indexOf("]]></title>");
			const title = buffer.slice(begTitle, endTitle).toString().trim();

			fs.closeSync(fd);
			res({
				date: fs.statSync(fn).mtime,
				title: title,
				id: movieId,
			});
		});
	},
	delete(html, id, mId) {
		if (html) {
			return new Promise((res, rej) => {
				const i = mId.indexOf("-");
				const prefix = mId.substr(0, i);
				const suffix = mId.substr(i + 1);
				switch (prefix) {
					case "e": {
						caché.clearTable(mId);
						let data = fs.readFileSync(`${exFolder}/${suffix}.zip`);
						res(data.subarray(data.indexOf(80)));
						break;
					}
					case "s":
					case "c":
					case "m": {
						let numId = Number.parseInt(suffix);
						if (isNaN(numId)) res();
						switch (prefix) {
							case "s": {
								var filePath = fUtil.getFileIndex("starter-", ".xml", numId);
								break;
							}
							case "m": {
								var filePath = fUtil.getFileIndex("movie-", ".xml", numId);
								break;
							}
							case "c": {
								var filePath = fUtil.getFileIndex("char-", ".xml", numId);
								break;
							}
						}
						if (!fs.existsSync(filePath)) res();

						fs.unlinkSync(filePath);
					}
					default: res();
				}
			});
		} else {
			return new Promise((res, rej) => {
				fs.unlinkSync(getStarterPath(id), (e, b) => {
					if (e) {
						var fXml = util.xmlFail();
						rej(Buffer.from(fXml));
					} else {
						res(b);
					}
				});
			});
		}
	},
	deleteThumb(html, id, mId) {
		if (html) {
			return new Promise((res, rej) => {
				const i = mId.indexOf("-");
				const prefix = mId.substr(0, i);
				const suffix = mId.substr(i + 1);
				switch (prefix) {
					case "e": {
						caché.clearTable(mId);
						let data = fs.readFileSync(`${exFolder}/${suffix}.zip`);
						res(data.subarray(data.indexOf(80)));
						break;
					}
					case "s":
					case "c":
					case "m": {
						let numId = Number.parseInt(suffix);
						if (isNaN(numId)) res();
						switch (prefix) {
							case "s": {
								var filePath = fUtil.getFileIndex("starter-", ".png", numId);
								break;
							}
							case "m": {
								var filePath = fUtil.getFileIndex("thumb-", ".png", numId);
								break;
							}
							case "c": {
								var filePath = fUtil.getFileIndex("char-", ".png", numId);
								break;
							}
						}
						if (!fs.existsSync(filePath)) res();

						fs.unlinkSync(filePath);
					}
					default: res();
				}
			});
		} else {
			return new Promise((res, rej) => {
				fs.unlinkSync(getThumbPath(id), (e, b) => {
					if (e) {
						var fXml = util.xmlFail();
						rej(Buffer.from(fXml));
					} else {
						res(b);
					}
				});
			});
		}
	},
};
