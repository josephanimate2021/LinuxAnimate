const loadPost = require('../request/post_body');
const header = process.env.XML_HEADER;
const fUtil = require('../fileUtil');
const nodezip = require('node-zip');
const base = Buffer.alloc(1, 0);
const user = require('./main');
const fs = require('fs');

module.exports = function (req, res, url) {
	if (req.method != 'POST') return;

	var makeZip = false; switch (url.path) {
		case '/goapi/getUserWatermarks/': break;
		default: return;
	}

	loadPost(req, res).then(async data => {
		var xmlString, files;
		files = asset.list(data.movieId, "watermark");
		xmlString = `${header}<watermarks>${files.map((v) => `<watermark id="${v.id}" thumbnail="${process.env.WATERMARKS_FOLDER}/${v.id}"/>`).join("")}</watermarks>`;
		res.setHeader('Content-Type', 'text/xml');
		res.end(xmlString);
	};
	return true;
}
