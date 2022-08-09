const loadPost = require("../misc/post_body");
const fs = require("fs");
const folder = process.env.STARTERS_FOLDER;
const util = require("../misc/util");
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) { 
		case "/goapi/getCCPreMadeCharacters": {
			res.end();
			return true;
		} case "/goapi/clientbug/": {
			res.end("1" + util.xmlFail("Unable to load some data. please try again later."));
		} default: return;
	}
};
