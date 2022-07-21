const loadPost = require("../misc/post_body");
const folder = process.env.WATERMARKS_FOLDER;
const fs = require("fs");
const http = require("http");

module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathanme) {
		case "/goapi/getCCPreMadeCharacters": {
			res.end();
			return true;
		}
		case "/goapi/getMovieInfo/": {
			loadPost(req, res).then(([data]) => {
				res.setHeader("Content-Type", "text/html; charset=UTF-8");
				const p = `${folder}/${data.movieId}.xml`;
				fs.createReadStream(p).pipe(res);
			});
			return true;
		}
	}
};
