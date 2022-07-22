module.exports = function (req, res) {
	if (req.method != "GET") return;
	const match = req.url.match(/\/_WATERMARKS\/(?:\.swf)?$/);
	if (!match) return;
	
	var ext = match[1];
	if (ext == "swf") {
		res.setHeader("Content-Type", "application/x-shockwave-flash");
		res.statusCode = 302;
		res.end();
	}
}
