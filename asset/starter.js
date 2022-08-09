const loadPost = require("../misc/post_body");
const header = process.env.XML_HEADER;
const fUtil = require("../misc/file");
const nodezip = require("node-zip");
const starter = require("../starter/main");
const base = Buffer.alloc(1, 0);
const asset = require("./main");
const http = require("http");
const fs = require("fs");

async function listAssets(data) {
	var files = starter.list();
	var xmlString = `${header}<ugc more="0">${files.map(v =>`<movie id="${v.id}" enc_asset_id="${v.id}" path="/_SAVED/${ v.id}" numScene="1" title="Untitled" thumbnail_url="/starter_thumbs/${v.id}"><tags></tags></movie>`).join("")}</ugc>`;
	const zip = nodezip.create();
	fUtil.addToZip(zip, "desc.xml", Buffer.from(xmlString));
  
	files.forEach((file) => {
		const buffer = asset.load(data.ut, file.id);
		fUtil.addToZip(zip, `${file.mode}/${file.id}`, buffer);
	});
	return await zip.zip();
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var makeZip = false;
	switch (url.pathname) {
		case "/goapi/getSysTemplateAttributes/":
			break;
		default:
			return;
	}
	loadPost(req, res).then(([data]) => listAssets(data)).then((buff) => {
		res.setHeader("Content-Type", "application/zip");
		res.end(buff);
	}).catch(e => console.log("Error:", e));
	return true;
};
