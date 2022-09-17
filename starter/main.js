var path = require('path');
const nodezip = require("node-zip");
const fs = require("fs");
const folder = "./files/starters";

module.exports = {
	loadZip(mId) {
		return new Promise((res, rej) => {
			var filePath = `${folder}/${mId}.xml`
			if (!fs.existsSync(filePath)) rej(`The File: ${filePath} Is Non Existant.`);
			const buffer = fs.readFileSync(filePath);
			if (!buffer || buffer.length == 0) rej("Your Starter Has Failed To Load. one of the common reasons for this is that there may be bugs in this LVM Project that is causing the issue. if that's the case, then please contact joseph the animator#2292 on discord for help.");
			parse.packMovie(buffer, mId).then(pack => res(pack.zipBuf)).catch(e => rej(e));
		});
	},
	loadXml(movieId) {
		return new Promise(async (res, rej) => {
			const fn = `${folder}/${movieId}.xml`;
			if (fs.existsSync(fn)) res(fs.readFileSync(fn));
			else rej("Your starter has failed to load via a GET request.");
		});
	},
	loadThumb(movieId) {
		const match = fs.readdirSync(folder).find(file => file.includes(`${movieId}.png`));
		return match ? fs.readFileSync(`${folder}/${match}`) : null;
	},
	list() {
		const table = [];
		fs.readdirSync(folder).forEach(fn => {
			if (!fn.includes(".xml")) return;
			// check if the movie and thumbnail exists
			const mId = fn.substring(0, fn.length - 4);
			const movie = fs.existsSync(`${folder}/${mId}.xml`);
			const thumb = fs.existsSync(`${folder}/${mId}.png`);
			if (movie && thumb) table.unshift({ id: mId });
		});
		return table;
	},
	meta(movieId) {
		const filepath = `${folder}/${movieId}.xml`;
		const buffer = fs.readFileSync(filepath);

		const begTitle = buffer.indexOf("<title>") + 16;
		const endTitle = buffer.indexOf("]]></title>");
		const subtitle = buffer.slice(begTitle, endTitle).toString().trim();
			
		const begTag = buffer.indexOf("<tag>") + 14;
		const endTag = buffer.indexOf("]]></tag>");
		const subtag = buffer.slice(begTag, endTag).toString();
		var title, tag;
			
		if (!subtitle) title = "Untitled Starter";
		else title = subtitle;
			
		if (!subtag) tag = "none";
		else tag = subtag;

		return {
			date: fs.statSync(filepath).mtime,
			title: title,
			tag: tag,
			id: movieId,
		};
	},
};
