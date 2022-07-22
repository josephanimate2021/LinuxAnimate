const http = require("http");
const fUtil = require("../misc/file");
const folder = process.env.THEME_FOLDER + "/";

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/goapi/getThemeList/") return;
	res.setHeader("Content-Type", "application/zip");
	const path = folder + "themelist.xml";
	fUtil.makeZip(path, "themelist.xml");
	return true;
};
