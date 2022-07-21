const fs = require("fs");
const path = require("path");
const folder = path.join(__dirname, "../../", process.env.SAVED_FOLDER);

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
	const filepath = path.join(folder, `${mId}-watermark.xml`);
	res.setHeader("Content-Type", "text/xml");
	if (!fs.existsSync(filepath)) {
		res.end('<watermarks><watermark style="freeTrial"/></watermarks>');
	} else {
		fs.readFileSync(filepath);
	}
};
