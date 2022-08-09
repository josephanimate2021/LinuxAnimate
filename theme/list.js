const fUtil = require('../misc/file');
const folder = process.env.THEME_FOLDER;
module.exports = function (req, res, url) {
	var path;
	if (req.headers.host != "localhost" && req.headers.host != `localhost:${process.env.SERVER_PORT}`) path = "/goapi/getThemeList/";
	else path = "/goapi/getThemeList/?";	
	if (req.method != 'POST' || url.path != path) return;
	res.setHeader('Content-Type', 'application/zip');
	fUtil.makeZip(`${folder}/themelist.xml`, 'themelist.xml').then(b => res.end(b)).catch(e => console.log("Error:", e));
	return true;
}
