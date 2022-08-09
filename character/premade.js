const loadPost = require("../misc/post_body");
const util = require("../misc/util");
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) { 
		case "/goapi/getCCPreMadeCharacters": {
			res.end();
			return true;
		} case "/goapi/clientbug/": {
			loadPost(req, res).then(data => {
				if (data.themeId != "common") {
					console.log(`Unable to load ${data.themeId} in the lvm. please try again later.`);
					return res.end(1 + util.xmlFail(`Unable to load ${data.themeId} in the lvm. please try again later.`));
				}
			});
		} default: return;
	}
};
