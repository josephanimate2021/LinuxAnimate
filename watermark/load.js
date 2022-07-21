var fs = require("fs");
var path = require("path");
var folder = path.join(__dirname, "../../", process.env.SAVED_FOLDER);
module.exports = function (req, res, url) {
	var pth = url.pathname;
	if (req.method != "POST" || pth != "/goapi/getMovieInfo/") return;
	var mId = url.query.movieId;
	var filepath = path.join(folder, `${mId}.xml`);
	var xml = fs.readFileSync(filepath);
	res.setHeader("Content-Type", "text/xml");
	if (!fs.existsSync(filepath)) {
		res.end('<watermarks><watermark style="freeTrial"/></watermarks>');
	} else {
		res.end(xml);
	}
};
