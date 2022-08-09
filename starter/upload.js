const formidable = require("formidable");
const fUtil = require("../misc/file");
const parse = require("../movie/parse");
const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/upload_starter") return;
	new formidable.IncomingForm().parse(req, (e, f, files) => {
		if (!files.import) return;
		var path = files.import.path;
		var buffer = fs.readFileSync(path);
		var numId = fUtil.generateId();
		if (req.headers.host == "localhost" && req.headers.host == `localhost:${process.env.SERVER_PORT}`) {
			parse.unpackStarterXml(buffer, `${numId}`);
		}
		fs.unlinkSync(path);

		res.statusCode = 302;
		res.setHeader("Location", "/");
		res.end();
	});
	return true;
};
