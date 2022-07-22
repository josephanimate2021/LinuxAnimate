const loadPost = require("../misc/post_body");
const fUtil = require("../misc/file");
const folder = process.env.THEME_FOLDER;
const fs = require("fs");
const http = require("http");

module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/goapi/getTheme/") return; 
	loadPost(req, res).then(([data]) => {
		const initcb = data.initcb;
		const type = initcb ? 'application/zip' : 'text/xml';
		res.setHeader('Content-Type', type);
		const p = `${folder}/${data.themeId}.xml`;
		if (!initcb) {
			// load lvm
			fUtil.makeZip(p, 'theme.xml').then(b => res.end(b));
		} else {
			// search themes
			fs.createReadStream(p).pipe(res);
		}
	});
	return true;
};
