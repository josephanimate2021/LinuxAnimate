const pjson = require("../package.json");
const stuff = require("./info");
const http = require("http");
const fs = require("fs");
const { rejects } = require("assert");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var methodLinks = stuff[req.method];
	for (let linkIndex in methodLinks) {
		var regex = new RegExp(linkIndex);
		if (regex.test(url.path)) {
			var t = methodLinks[linkIndex];
			var link = t.regexLink ? url.path.replace(regex, t.regexLink) : t.link || url.path;
			var headers = t.headers;
			var path = `./${link}`;

			try {
				for (var headerName in headers || {}) {
					res.setHeader(headerName, headers[headerName]);
				}
				res.statusCode = t.statusCode || 200;
				if (t.content !== undefined) {
					res.end(t.content);
				} else if (fs.existsSync(path)) {
					if (t.contentReplace) {
						content = fs.readFileSync(path, "utf8");
						content = content.replace(/VERSIÖN/g, pjson.versionStr);
						const apiPath = `./${link}/../`;
						content = content.replace(/LINK/g, `<a href="https://josephanimate2021.github.io/lvm-static/2014?api=${apiPath}&action=create&tutorial=0&tray=retro">here</a>`;
						res.end(content);
					} else {
						fs.createReadStream(path).pipe(res);
					}
				} else throw null;
			} catch (e) {
				res.statusCode = t.statusCode || 404;
				console.log("Error:", e);
			}
			return true;
		}
	}
	return false;
};
