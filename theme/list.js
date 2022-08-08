const http = require("http");
const fUtil = require("../misc/file");
const folder = process.env.THEME_FOLDER + "/";

async function makeList(res) {
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
if (process.env.OLD_VIDEOMAKER == "false") {
	module.exports = function (res, req, url) {
		if (req.method != "POST" || url.path != "/goapi/getThemeList/") return;
		makeList(res);
	};
} else {
	// make the list for old videomakers via using localhost
	module.exports = function (res, req, url) {
		if (req.method != "POST" || url.path != "/goapi/getThemeList/?") return;
		makeList(res);
	};
}
