module.exports = function (req, res, url) {
	if (req.method != 'POST') return;

	var makeZip = false; switch (url.path) {
		case '/goapi/getUserWatermarks/': break;
		default: return;
	}
	var xmlString = `<?xml encoding="UTF-8"?><watermarks><watermark id="174tbqdo0cs6" name="GoAnimate For Schools Logo" thumbnail="${process.env.WATERMARKS_FOLDER}/Go4Schools.png"/><preview>174tbqdo0cs6</preview><watermark id="52ht3dd60csd" thumbnail="${process.env.WATERMARKS_FOLDER}/GoMakeYourOwn.png" name="Go Make Your Own Logo/><preview>52ht3dd60csd</preview></watermarks>`;
	res.setHeader('Content-Type', 'text/xml');
	res.end(xmlString);
	return true;
}
