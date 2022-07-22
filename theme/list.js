const http = require("http");
const fs = require("fs");
const folder = process.env.THEME_FOLDER;

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/goapi/getThemeList/") return;
	res.setHeader("Content-Type", "text/xml");
	fs.readFileSync(`${folder}/_themelist.xml`);
	return true;
};
