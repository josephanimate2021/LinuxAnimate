const loadPost = require('../request/post_body');
const header = process.env.XML_HEADER;

module.exports = function (req, res, url) {
	if (req.method != 'POST') return;

	switch (url.path) {
		case '/goapi/getUserWatermarks/': break;
		default: return;
	}

	loadPost(req, res).then(async data => {
		var xmlString, files, content;
		xmlString = `${header}<watermarks><watermark id="0dhteqDBt5nY"/></watermarks>`;
		res.setHeader('Content-Type', 'text/xml');
		res.end(xmlString);
	};
	return true;
}
