const folder = process.env.SAVED_FOLDER;

module.exports = function (req, res, url) {
	if (req.method != "POST") return; 
	switch (url.pathname) {
		case "/goapi/getMovieInfo/": {
			var filepath = `${folder}/${url.query.movieId}.xml`;
			var xml;
			if (!fs.existsSync(filepath)) {
				xml = '<watermarks><watermark style="freeTrial"/></watermarks>';
			} else {
				xml = fs.readFileSync(filepath);
			}
			res.setHeader("Content-Type", "text/xml");
			console.log(xml);
			res.end(xml);
			return true;
		}
	}
};
