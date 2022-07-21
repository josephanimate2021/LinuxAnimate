const watermark = require("../asset/main");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	const match = req.url.match(/\/goapi\/assignwatermark\/movie\/([^.]+)\/([^.]+)$/);
	if (!match) return;
	var id = match[1];
	var wId = match[2];
	var wd;
	if (wId == "0dhteqDBt5nY") {
		wd = "0dhteqDBt5nY";
	} else {
		wd = wId;
	}
	var mode;
	watermark.save(id, wd, mode = "watermark");
}
