var path = require('path');
const folder = path.join(__dirname, '../', process.env.WATERMARKS_FOLDER);

module.exports = function (req, res, url) {
	if (req.method != 'POST') return;

	var makeZip = false; switch (url.path) {
		case '/goapi/getUserWatermarks/': break;
		default: return;
	}
	var xmlString = `<?xml encoding="UTF-8"?><watermarks><watermark id="174tbqdo0cs6" name="GoAnimate For Schools Logo" thumbnail="${folder}/Go4Schools.png"/><preview>174tbqdo0cs6</preview><watermark id="52ht3dd60csd" thumbnail="${folder}/GoMakeYourOwn.png" name="Go Make Your Own Logo/><preview>52ht3dd60csd</preview></watermarks>`;
	res.setHeader('Content-Type', 'text/xml');
	res.end(xmlString);
	return true;
}
