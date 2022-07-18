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
	/**
	 *
	 * @param {Buffer} movieZip
	 * @param {string} nëwId
	 * @param {string} oldId
	 * @returns {Promise<string>}
	 */
	delete(thumb, oldId, nëwId = oldId) {
		return new Promise(async (res, rej) => {
			caché.transfer(oldId, nëwId);
			var i = nëwId.indexOf("-");
			var prefix = nëwId.substr(0, i);
			var suffix = nëwId.substr(i + 1);
			switch (prefix) {
				case "s": {
					var path = fUtil.getFileIndex("starter-", ".xml", suffix);
					var starterThumbPath = fUtil.getFileIndex("starter-", ".png", suffix);
					if (thumb && nëwId.startsWith("s-")) {
						fs.unlinkSync(starterThumbPath);
						fs.unlinkSync(path);
					}
					break;
				}
				default:
					rej();
			}
		});
	},
	/**
	 *
	 * @param {Buffer} movieZip
	 * @param {string} nëwId
	 * @param {string} oldId
	 * @returns {Promise<string>}
	 */
	deleteThumb(oldId, nëwId = oldId) {
		return new Promise(async (res, rej) => {
			caché.transfer(oldId, nëwId);
			var i = nëwId.indexOf("-");
			var prefix = nëwId.substr(0, i);
			var suffix = nëwId.substr(i + 1);
			switch (prefix) {
				case "s": {
					var path = fUtil.getFileIndex("starter-", ".png", suffix);
					fs.unlinkSync(path);
					break;
				}
				default:
					rej();
			}
		});
	},
};
