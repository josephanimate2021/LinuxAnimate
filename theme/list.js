const http = require("http");
const fUtil = require("../misc/file");
const folder = process.env.THEME_FOLDER + "/";

async function makeList(req, res, url) {
	res.setHeader("Content-Type", "application/zip");
	const path = folder + "themelist.xml";
	fUtil.makeZip(path, "themelist.xml").then((b) => res.end(b));
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
	await makeList(req, res, url);
};
