module.exports = function (req, res, url) {
	const fs = require("fs");
	const path = require("path");
	const folder = path.join(__dirname, "../../", process.env.SAVED_FOLDER);
	var pth = url.pathname;
	var mId = url.query.movieId;
	const filepath = path.join(folder, `${mId}-watermark.xml`);
	const xml = fs.readFileSync(filepath);
	if (req.method != "POST" || pth != "/goapi/getMovieInfo/") return;
	res.setHeader("Content-Type", "text/xml");
	if (!fs.existsSync(filepath)) {
		res.end('<watermarks><watermark style="freeTrial"/></watermarks>');
	} else {
		res.end(xml);
	}
};
