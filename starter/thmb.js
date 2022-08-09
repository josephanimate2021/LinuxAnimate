const http = require("http");
const starter = require("./main");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
 module.exports = function (req, res, url) {
	const match = req.url.match(/\/starter_thumbs\/([^/]+)$/);
	if (!match) return;
	const mId = match[1];

	try {
		const sThmb = starter.loadThumb(mId);
		res.setHeader("Content-Type", "image/png");
		res.end(sThmb);
	} catch (e) {
		res.statusCode = 404;
		console.log("Error:", e);
	}
	return true;
}