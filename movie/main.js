const caché = require("../asset/caché");
var path = require('path');
const fUtil = require("../misc/file");
const nodezip = require("node-zip");
const parse = require("./parse");
const fs = require("fs");

module.exports = {
	/**
	 *
	 * @param {Buffer} movieZip
	 * @param {string} nëwId
	 * @param {string} oldId
	 * @returns {Promise<string>}
	 */
	 save(movieZip, thumb, mId) {
		return new Promise(async (res, rej) => {
			var zip = nodezip.unzip(movieZip);
			var id;
			try {
				id = fUtil.getFileId("movie-", ".xml");
			} catch (e) {
				id = fUtil.getNextFileId("movie-", ".xml");
			}
			const thumbFile = fUtil.getFileIndex("thumb-", ".png", id);
			fs.writeFileSync(thumbFile, thumb);
			var path = fUtil.getFileIndex("movie-", ".xml", id);
			var writeStream = fs.createWriteStream(path);
			var assetBuffers = caché.loadTable("m-" + id);
			parse.unpackMovie(zip, thumb, assetBuffers).then((data) => {
				writeStream.write(data, () => {
					writeStream.close();
					res("m-" + id);
				});
			});
		});
	},
	loadZip(mId) {
		return new Promise((res, rej) => {
			const i = mId.indexOf("-");
			const prefix = mId.substr(0, i);
			const suffix = mId.substr(i + 1);
			switch (prefix) {
				case "s":
				case "m": {
					let numId = Number.parseInt(suffix);
					if (isNaN(numId)) rej(`The ID: ${numId} Is Non Existant.`);
					var filePath;
					switch (prefix) {
						case "m": {
							filePath = fUtil.getFileIndex("movie-", ".xml", numId);
							break;
						}
						case "s": {
							filePath = fUtil.getFileIndex("starter-", ".xml", numId);
							break;
						}
					}
					if (!fs.existsSync(filePath)) rej(`The File: ${filePath} Is Non Existant.`);

					const buffer = fs.readFileSync(filePath);
					if (!buffer || buffer.length == 0) rej("Your Movie Has Failed To Load. one of the common reasons for this is either your movie is curupt, or there are bugs in this LVM Project that is causing the issue. if that's the case, then please contact joseph the animator#2292 on discord for help.");

					try {
						parse.packMovie(buffer, mId).then((pack) => {
							caché.saveTable(mId, pack.caché);
							res(pack.zipBuf);
						});
						break;
					} catch (e) {
						rej("Your movie has failed to pack. one of the common reasons for this is either your movie is curupt, or there are bugs in this LVM Project that is causing the issue. if that's the case, then please contact joseph the animator#2292 on discord for help.");
					}
				}
				default:
					rej("Honestly, there is really nothing to buffer here.");
			}
		});
	},
	delete(mId) {
		return new Promise((rej) => {
			const i = mId.indexOf("-");
			const prefix = mId.substr(0, i);
			const suffix = mId.substr(i + 1);
			switch (prefix) {
				case "s":
				case "c":
				case "m": {
					let numId = Number.parseInt(suffix);
					if (isNaN(numId)) rej(`The ID: ${numId} Is Non Existant.`);
					var filePath;
					switch (prefix) {
						case "s": {
							filePath = fUtil.getFileIndex("starter-", ".xml", numId);
							break;
						}
						case "c": {
							filePath = fUtil.getFileIndex("char-", ".xml", numId);
							break;
						}
						case "m": {
							filePath = fUtil.getFileIndex("movie-", ".xml", numId);
							break;
						}
					}
					if (!fs.existsSync(filePath)) rej(`The File: ${filePath} Is Non Existant.`);
					fs.unlinkSync(filePath);
					var path = `${process.env.SAVED_FOLDER}/${mId}.xml`;
					if (!fs.existsSync(path)) rej(`The Path: ${path} Is Non Existant.`);
					fs.unlinkSync(path);
					fs.unlinkSync(fUtil.getFileIndex("thumb-", ".png", numId));
				}
				default: rej("THere is nothing to delete.");
			}
		});
	},
	deleteThumb(mId) {
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
						case "c": {
							var filePath = fUtil.getFileIndex("char-", ".png", numId);
							break;
						}
						case "m": {
							var filePath = fUtil.getFileIndex("thumb-", ".png", numId);
							break;
						}
					}
					if (!fs.existsSync(filePath)) res();

					fs.unlinkSync(filePath);
				}
				default:
					res();
			}
		});
	},
	loadXml(movieId) {
		return new Promise(async (res, rej) => {
			const i = movieId.indexOf("-");
			const prefix = movieId.substr(0, i);
			const suffix = movieId.substr(i + 1);
			switch (prefix) {
				case "m": {
					const fn = fUtil.getFileIndex("movie-", ".xml", suffix);
					if (fs.existsSync(fn)) res(fs.readFileSync(fn));
					else rej();
					break;
				}
				case "s": {
					const fn = fUtil.getFileIndex("starter-", ".xml", suffix);
					if (fs.existsSync(fn)) res(fs.readFileSync(fn));
					else rej();
					break;
				}
				case "e": {
					const fn = `${exFolder}/${suffix}.zip`;
					if (!fs.existsSync(fn)) return rej();
					parse
						.unpackMovie(nodezip.unzip(fn))
						.then((v) => res(v))
						.catch((e) => rej(e));
					break;
				}
				default:
					rej();
			}
		});
	},
	loadThumb(movieId) {
		return new Promise(async (res, rej) => {
			if (!movieId.startsWith("m-")) return;
			const n = Number.parseInt(movieId.substr(2));
			const fn = fUtil.getFileIndex("thumb-", ".png", n);
			isNaN(n) ? rej() : res(fs.readFileSync(fn));
		});
	},
	loadStarterImg(movieId) {
		return new Promise(async (res, rej) => {
			if (!movieId.startsWith("s-")) return;
			const n = Number.parseInt(movieId.substr(2));
			const fn = fUtil.getFileIndex("starter-", ".png", n);
			isNaN(n) ? rej() : res(fs.readFileSync(fn));
		});
	},
	list(starter) {
		if (starter) {
			const array = [];
			const last = fUtil.getLastFileIndex("starter-", ".xml");
			for (let c = last; c >= 0; c--) {
				const movie = fs.existsSync(fUtil.getFileIndex("starter-", ".xml", c));
				const thumb = fs.existsSync(fUtil.getFileIndex("starter-", ".png", c));
				if (movie && thumb) array.push(`s-${c}`);
			}
			return array;
		} else {
			const array = [];
			const last = fUtil.getLastFileIndex("movie-", ".xml");
			for (let c = last; c >= 0; c--) {
				const movie = fs.existsSync(fUtil.getFileIndex("movie-", ".xml", c));
				const thumb = fs.existsSync(fUtil.getFileIndex("thumb-", ".png", c));
				if (movie && thumb) array.push(`m-${c}`);
			}
			return array;
		}
	},
	listCharacters() {
		const array = [];
		const last = fUtil.getLastFileIndex("char-", ".xml");
		for (let c = last; c >= 0; c--) {
			const char = fs.existsSync(fUtil.getFileIndex("char-", ".xml", c));
			const thumb = fs.existsSync(fUtil.getFileIndex("char-", ".png", c));
			if (char && thumb) array.push(`c-${c}`);
		}
		return array;
	},
	listStarters() {
		var table = [];
		var ids = fUtil.getValidFileIndicies("starter-", ".xml");
		for (const i in ids) {
			var id = `s-${ids[i]}`;
			table.unshift({ id: id });
		}
		return table;
	},
	meta(movieId) {
		return new Promise(async (res, rej) => {
			if (!movieId.startsWith("m-")) return;
			const n = Number.parseInt(movieId.substr(2));
			const fn = fUtil.getFileIndex("movie-", ".xml", n);

			const fd = fs.openSync(fn, "r");
			const buffer = Buffer.alloc(256);
			fs.readSync(fd, buffer, 0, 256, 0);
			const begTitle = buffer.indexOf("<title>") + 16;
			const endTitle = buffer.indexOf("]]></title>");
			const subtitle = buffer.slice(begTitle, endTitle).toString().trim();
			
			const begDesc = buffer.indexOf("<desc>") + 15;
			const endDesc = buffer.indexOf("]]></desc>");
			const desc = buffer.slice(begDesc, endDesc).toString();
			
			const begTag = buffer.indexOf("<tag>") + 14;
			const endTag = buffer.indexOf("]]></tag>");
			const subtag = buffer.slice(begTag, endTag).toString();
			var title, tag;
			
			if (!subtitle) {
				title = "Untitled Video";
			} else {
				title = subtitle;
			}
			
			if (!subtag) {
				tag = "none";
			} else {
				tag = subtag;
			}

			const begDuration = buffer.indexOf('duration="') + 10;
			const endDuration = buffer.indexOf('"', begDuration);
			const duration = Number.parseFloat(buffer.slice(begDuration, endDuration));
			const min = ("" + ~~(duration / 60)).padStart(2, "0");
			const sec = ("" + ~~(duration % 60)).padStart(2, "0");
			const durationStr = `${min}:${sec}`;
			
			var watermarks;
			const wtrTxt = `${process.env.SAVED_FOLDER}/${movieId}.xml`;
			if (!fs.existsSync(wtrTxt)) {
				watermarks = "No Logo";
			} else {
				const wBuffer = fs.readFileSync(wtrTxt);
				const begWtr = wBuffer.indexOf("<watermark>");
				const endWtr = wBuffer.indexOf("</watermark>");
				watermarks = wBuffer.subarray(begWtr, endWtr).toString();
			}

			fs.closeSync(fd);
			res({
				date: fs.statSync(fn).mtime,
				durationString: durationStr,
				duration: duration,
				title: title,
				desc: desc,
				tag: tag,
				watermark: watermarks,
				id: movieId,
			});
		});
	},
};
