var path = require('path');

module.exports = function (req, res, url) {
	if (req.method != 'POST') return;

	var makeZip = false; switch (url.path) {
		case '/goapi/getUserWatermarks/': break;
		default: return;
	}
	var xmlString = `<?xml encoding="UTF-8"?><watermarks><watermark id="174tbqdo0cs6" name="GoAnimate For Schools Logo" thumbnail="${path.join(__dirname, '../', process.env.WATERMARKS_FOLDER) + '/Go4Schools.png', 'utf8'}"/><preview>174tbqdo0cs6</preview><watermark id="52ht3dd60csd" thumbnail="${path.join(__dirname, '../', process.env.WATERMARKS_FOLDER) + '/GoMakeYourOwn.png', 'utf8'}" name="Go Make Your Own Logo/><preview>52ht3dd60csd</preview></watermarks>`;
	res.setHeader('Content-Type', 'text/xml');
	res.end(xmlString);
	return true;
}
