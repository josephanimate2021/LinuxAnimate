const http = require("http");
const movie = require("./main");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
 module.exports = function (req, res, url) {
	const match = req.url.match(/\/movie_thumbs\/([^/]+)$/);
	if (!match) return;
	const mId = match[1];

	try {
		const mThmb = movie.loadThumb(mId);
		res.setHeader("Content-Type", "image/png");
		res.end(mThmb);
	} catch (e) {
		res.statusCode = 404;
		console.log("Error:", e);
	}
	return true;
}
