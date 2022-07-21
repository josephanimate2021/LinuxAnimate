const folder = process.env.SAVED_FOLDER;

module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/goapi/getMovieInfo/") return;
	var mId = url.query.movieId;
	var filepath = `${folder}/${mId}.xml`;
	var xml;
	if (!fs.existsSync(filepath)) {
		xml = '<watermarks><watermark style="freeTrial"/></watermarks>';
	} else {
		xml = fs.readFileSync(filepath);
	}
	res.setHeader("Content-Type", "text/xml");
	res.end(xml);
};
