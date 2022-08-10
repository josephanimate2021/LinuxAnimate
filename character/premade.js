const loadPost = require("../misc/post_body");
const util = require("../misc/util");
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) { 
		case "/goapi/getCCPreMadeCharacters": {
			res.end();
			return true;
		} case "/goapi/getUserWatermarks/": {
			res.end('<watermarks><current/><preview/></watermarks>');
			return true;
		} default: return;
	}
};
