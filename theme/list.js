const http = require("http");
const fUtil = require("../misc/file");
const folder = process.env.THEME_FOLDER + "/";

async function makeList(req, res, url) {
	const path = folder + "themelist.xml";
	const zip = await fUtil.makeZip(path, "themelist.xml");
	res.setHeader("Content-Type", "application/zip");
	res.end(zip);
	return true;
}
	

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/goapi/getThemeList/") return;
	makeList(req, res, url);
};
