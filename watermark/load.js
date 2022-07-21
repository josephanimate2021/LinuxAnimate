const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var path = url.pathname;
	if (req.method != "POST" || path != "/goapi/getMovieInfo/") return;
	res.setHeader("Content-Type", "text/xml");
	const wId = fs.readFileSync(`${process.env.SAVED_FOLDER}/${url.query.movieId}-watermark.xml`);
	if (!wId) {
		res.end('<watermarks><watermark style="freeTrial"/></watermarks>');
	} else {
		res.end(wId);
	}
};
