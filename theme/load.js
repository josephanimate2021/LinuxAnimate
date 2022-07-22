const loadPost = require("../misc/post_body");
const fUtil = require("../misc/file");
const folder = process.env.THEME_FOLDER + "/";
const fs = require("fs");
const http = require("http");

module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/goapi/getTheme/") return; 
	loadPost(req, res).then(([data]) => {
		res.setHeader('Content-Type', 'application/zip');
		const p = folder + `${data.themeId}.xml`;
		fUtil.makeZip(p, 'theme.xml').then(b => res.end(b));
	});
	return true;
};
