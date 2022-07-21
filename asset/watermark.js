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
		files = asset.list(data.movieId, "watermark");
		files.map(v => {
			if (v.id == "0dhteqDBt5nY") {
				content = `<watermark id="0dhteqDBt5nY"/>`;
			} else {
				content = `<watermark id="${v.id} thumbnail="${process.env.WATERMARKS_FOLDER}/${v.id}"/>`;
			}
			xmlString = `${header}<watermarks>${content}</watermarks>`;
			res.setHeader('Content-Type', 'text/xml');
			res.end(xmlString);
		});
	};
	return true;
}
