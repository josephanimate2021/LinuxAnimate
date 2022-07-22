const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var path = url.pathname;
	if (req.method != "GET" || !path.startsWith("/watermark_thumbs")) return;
	fs.readFileSync(process.env.WATERMARKS_FOLDER + path.substr(path.lastIndexOf("/"))).then((v) => res.end(v));
	return true;
};
