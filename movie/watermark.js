const header = process.env.XML_HEADER;
const movie = require("./main");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	switch (req.method) {
		case "POST": {
			const match = req.url.match(/\/goapi\/assignwatermark\/movie\/([^.]+)\/([^.]+)$/);
			if (!match) return;
			var id = match[1];
			var wId = match[2];
			movie.watermark(id, wId);
			break;
		}
	}
}
