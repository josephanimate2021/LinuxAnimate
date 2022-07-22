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
	files = asset.list(mId, "watermark");
	xmlString = `<?xml encoding="UTF-8"?><watermarks><watermark id="174tbqdo0cs6" thumbnail="${process.env.WATERMARKS_FOLDER}/Go4Schools.png" name="GoAnimate For Schools Logo"/><preview>174tbqdo0cs6</preview><watermark id="82tkgqdefbw6" thumbnail="${process.env.WATERMARKS_FOLDER}/freeTrial.png" name="GoAnimate Free Trial Logo"/><preview>82tkgqdefbw6</preview><watermark id="52ht3dd60csd" thumbnail="${process.env.WATERMARKS_FOLDER}/GoMakeYourOwn.png" name="GoAnimate - Go Make Your Own Logo"/><preview>52ht3dd60csd</preview>${files.map(v => `<watermark id="${v.id}" thumbnail="${process.env.WATERMARKS_FOLDER}/${v.id}" name="Custom Logo"/><preview>${v.id}</preview>`).join("")}</watermarks>`;
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
		case "/goapi/getUserWatermarks/":
			break;
		default:
			return;
	}

	switch (req.method) {
		case "GET": {
			var q = url.query;
			if (q.movieId && q.type) {
				listAssets(q).then((buff) => {
					res.setHeader("Content-Type", "text/xml");
					res.end(buff);
				});
				return true;
			} else {
				return;
			}
		}
		case "POST": {
			loadPost(req, res).then(([data]) => listAssets(data)).then((buff) => {
				res.setHeader("Content-Type", "text/xml");
				if (makeZip) res.write(base);
				res.end(buff);
			});
			return true;
		}
		default:
			return;
	}
};
