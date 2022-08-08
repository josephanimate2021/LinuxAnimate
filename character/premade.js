const loadPost = require("../misc/post_body");
const fs = require("fs");
const folder = process.env.STARTERS_FOLDER;
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) { 
		case "/goapi/getCCPreMadeCharacters": {
			res.end();
			return true;
		} case "/goapi/getSysTemplates/": {
			loadPost(req, res).then(([data]) => {
				const buffer = fs.readFileSync(`${folder}/${data.themeId}.xml`);
				res.end(buffer);
			});
			return true;
		} default: return;
	}
};
