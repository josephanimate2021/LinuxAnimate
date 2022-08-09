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
		const numId = fUtil.generateId();
		switch (req.headers.host) {
			case "localhost": 
			case `localhost:${process.env.SERVER_PORT}`: {
				parse.unpackStarterXml(buffer, `${numId}`);
				break;
			}
		}
		fs.unlinkSync(path);
		res.statusCode = 302;
		// why
		var apiPath, url;
		if (req.headers.host != "localhost" && req.headers.host != `localhost:${process.env.SERVER_PORT}`) {
			url = `/`;
		} else {
			apiPath = `http://${req.headers.host}`;
			url = `https://josephanimate2021.github.io/lvm-static/2014?api=${apiPath}&action=edit&movieId=${numId}`;
		}
		res.setHeader("Location", url);
		res.end();
	});
	return true;
};
