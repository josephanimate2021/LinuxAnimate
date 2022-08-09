const caché = require("../asset/caché");
var path = require('path');
const fUtil = require("../misc/file");
const nodezip = require("node-zip");
const parse = require("./parse");
const fs = require("fs");
const folder = process.env.SAVED_FOLDER;

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
			mId ||= fUtil.generateId();
			const thumbFile = `${folder}/${mId}.png`
			if (thumb) fs.writeFileSync(thumbFile, thumb);
			var path = `${folder}/${mId}.xml`
			var writeStream = fs.createWriteStream(path);
			parse.unpackMovie(zip, thumb).then((data) => {
				writeStream.write(data, () => {
					writeStream.close();
					res(mId);
				});
			});
		});
	},
	loadZip(mId) {
		return new Promise((res, rej) => {
			var filePath = `${folder}/${mId}.xml`
			if (!fs.existsSync(filePath)) rej(`The File: ${filePath} Is Non Existant.`);
			const buffer = fs.readFileSync(filePath);
			if (!buffer || buffer.length == 0) rej("Your Movie Has Failed To Load. one of the common reasons for this is either your movie is curupt, or there are bugs in this LVM Project that is causing the issue. if that's the case, then please contact joseph the animator#2292 on discord for help.");
			parse.packMovie(buffer, mId).then(pack => res(pack.zipBuf)).catch(e => rej(e));
		});
	},
	delete(mId) {
		return new Promise((res, rej) => {
			var filePath = `${folder}/${mId}.xml`;
			if (!fs.existsSync(filePath)) rej(`The File: ${filePath} Is Non Existant.`);
			fs.unlinkSync(filePath);
			var thumbFile = `${folder}/${mId}.png`;
			if (!fs.existsSync(thumbFile)) rej(`The File: ${thumbFile} Is Non Existant.`);
			fs.unlinkSync(thumbFile);
		});
	},
	loadXml(movieId) {
		return new Promise(async (res, rej) => {
			const fn = `${folder}/${movieId}.xml`;
			if (fs.existsSync(fn)) res(fs.readFileSync(fn));
			else rej("Your movie has failed to load via a GET request.");
		});
	},
	loadThumb(movieId) {
		return new Promise((res, rej) => {
			const match = fs.readdirSync(folder).find(file => file.includes(`${movieId}.png`));
			match ? fs.readFileSync(`${folder}/${match}`) : rej(`${match} Is Non Exsistant`);
		});
	},
	list() {
		const array = [];
		fs.readdirSync(folder).forEach(fn => {
			if (!fn.includes(".xml")) return;
			// check if the movie and thumbnail exists
			const mId = fn.substring(0, fn.length - 4);
			const movie = fs.existsSync(`${folder}/${mId}.xml`);
			const thumb = fs.existsSync(`${folder}/${mId}.png`);
			if (movie && thumb) array.push(mId);
		});
		return array;
	},
	meta(movieId) {
		const filepath = `${folder}/${movieId}.xml`;
		const buffer = fs.readFileSync(filepath);

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
			
		if (!subtitle) title = "Untitled Video";
		else title = subtitle;
			
		if (!subtag) tag = "none";
		else tag = subtag;

		const begDuration = buffer.indexOf('duration="') + 10;
		const endDuration = buffer.indexOf('"', begDuration);
		const duration = Number.parseFloat(buffer.slice(begDuration, endDuration));
		const min = ("" + ~~(duration / 60)).padStart(2, "0");
		const sec = ("" + ~~(duration % 60)).padStart(2, "0");
		const durationStr = `${min}:${sec}`;
			
		const begWide = buffer.indexOf('isWide="') + 8;
		const endWide = buffer.indexOf('"', begWide);
		const isWide = Number.parseFloat(buffer.slice(begWide, endWide))

		var wideo;
		if (isWide == "1") wideo = "1";
		else wideo = "0";

		var res;
		if (isWide == "1") res = "16:9";
		else res = "14:9";

		var watermarks;
		const wtrTxt = `${process.env.SAVED_FOLDER}/${movieId}-watermark.xml`;
		if (!fs.existsSync(wtrTxt)) watermarks = "No Logo";
		else {
			const wBuffer = fs.readFileSync(wtrTxt);
			const begWtr = wBuffer.indexOf("<watermark>");
			const endWtr = wBuffer.indexOf("</watermark>");
			watermarks = wBuffer.subarray(begWtr, endWtr).toString();
		}

		return {
			date: fs.statSync(filepath).mtime,
			durationString: durationStr,
			duration: duration,
			title: title,
			desc: desc,
			tag: tag,
			wide: wideo,
			res: res,
			watermark: watermarks,
			id: movieId,
		};
	},
};
