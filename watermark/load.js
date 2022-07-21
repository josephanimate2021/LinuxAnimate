const fs = require("fs");
const folder = process.env.SAVED_FOLDER;

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var path = url.pathname;
	if (req.method != "POST" || path != "/goapi/getMovieInfo/") return;
	var mId = url.query.movieId;
	var filePath = `${folder}/${mId}-watermark.xml`;
	res.setHeader("Content-Type", "text/xml");
	if (!fs.existsSync(filePath)) {
		res.end('<watermarks><watermark style="freeTrial"/></watermarks>');
	} else {
		res.end(fs.readFileSync(`${folder}/${mId}-watermark.xml`));
	}
};
