const loadPost = require("../misc/post_body");
const folder = process.env.WATERMARKS_FOLDER;
const fs = require("fs");
const http = require("http");

module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/fbapi/getMovieInfo/") return; 
	loadPost(req, res).then(([data]) => {
		res.setHeader("Content-Type", "text/html; charset=UTF-8");
		const p = `${folder}/${data.movieId}.xml`;
		if (!fs.existsSync(p)) {
			// don't load any watermarks if a user watermark does not exist.
			res.end('<movie owner="NederlandComedian" id="0Ndt5hDY9FwM"/><watermarks><watermark style="visualplugin"/></watermarks>');
		} else {
			fs.createReadStream(p).pipe(res);
		}
	});
	return true;
};
