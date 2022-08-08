const fUtil = require('../misc/file');
const folder = process.env.THEME_FOLDER;
module.exports = function (req, res, url) {
	if (req.method != 'POST' || url.path != '/goapi/getThemeList/?') return;
	res.setHeader('Content-Type', 'application/zip');
	fUtil.makeZip(`${folder}/themelist.xml`, 'themelist.xml').then(b => res.end(b)).catch(e => console.log("Error:", e));
	return true;
}
