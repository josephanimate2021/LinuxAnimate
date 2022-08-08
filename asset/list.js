const loadPost = require("../misc/post_body");
const header = process.env.XML_HEADER;
const fUtil = require("../misc/file");
const nodezip = require("node-zip");
const movie = require("../movie/main");
const base = Buffer.alloc(1, 0);
const asset = require("./main");
const http = require("http");
const fs = require("fs");

async function listAssets(data) {
	var mId = data.movieId;
	var xmlString, files;
	switch (data.type) {
		case "char": {
			const chars = await asset.chars(data.themeId);
			xmlString = `${header}<ugc more="0">${chars
				.map(
					(v) =>
						`<char id="${v.id}" name="Untitled" cc_theme_id="${v.theme}" thumbnail_url="/char_thumbs/${v.id}.png" copyable="Y"><tags/></char>`
				)
				.join("")}</ugc>`;
			break;
		}
		case "bg": {
			files = asset.list(mId, "bg");
			xmlString = `${header}<ugc more="0">${files
				.map((v) => `<background subtype="0" id="${v.id}" name="${v.name}" enable="Y"/>`)
				.join("")}</ugc>`;
			break;
		}
		case "sound": {
			files = asset.list(mId, "sound");
			xmlString = `${header}<ugc more="0">${files
				.map((v) =>`<sound subtype="${v.subtype}" id="${v.id}" name="${v.name}" enable="Y" duration="${v.duration}" downloadtype="progressive"/>`)
				.join("")}</ugc>`;
			break;
		}
		case "movie": {
			files = movie.listStarters();
			xmlString = `${header}<ugc more="0">${files
				.map(
					(v) =>
						`<movie id="${v.id}" enc_asset_id="${v.id}" path="/_SAVED/${v.id}" numScene="1" title="Untitled" thumbnail_url="/starter_thumbs/${v.id}.png"><tags></tags></movie>`
				)
				.join("")}</ugc>`;
			break;
		}
		case "prop": {
			files = asset.list(mId, "prop");
			xmlString = `${header}<ugc more="0">${files
				.map(
				        (v) =>
						`<prop subtype="0" id="${v.id}" name="${v.name}" enable="Y" holdable="0" headable="0" placeable="1" facing="left" width="0" height="0" asset_url="${process.env.PROPS_FOLDER}/${v.id}"/>`
				)
				.join("")}</ugc>`;
			break;
		}
		default: {
			xmlString = `${header}<ugc more="0"></ugc>`;
			break;
		}
	}
	
	switch (data.subtype) {
		case "video": {
			files = asset.list(mId, "video");
			xmlString = `${header}<ugc more="0">${files
				.map(
					(v) =>
						`<prop subtype="video" id="${v.id}" name="${v.name}" enable="Y" holdable="0" headable="0" placeable="1" facing="left" width="10" height="10" thumbnail_url=""/>`
				)
				.join("")}</ugc>`;
			break;
		}
	}
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
		case "/goapi/getUserAssets/":
			break;
		default:
			return;
	}

	switch (req.method) {
		case "GET": {
			var q = url.query;
			if (q.movieId && q.type) {
				listAssets(q, makeZip).then((buff) => {
					res.setHeader("Content-Type", "text/xml");
					res.end(buff);
				});
				return true;
			} else return;
		}
		case "POST": {
			loadPost(req, res).then(([data]) => {
				console.log(data);
				listAssets(data, makeZip).then((buff) => {
					res.setHeader("Content-Type", "text/xml");
					res.end(buff);
				});
			});
			return true;
		}
		default:
			return;
	}
};
