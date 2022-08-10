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
				for (var headerName in headers || {}) res.setHeader(headerName, headers[headerName]);
				res.statusCode = t.statusCode || 200;
				if (t.content !== undefined) res.end(t.content);
				else if (fs.existsSync(path)) {
					if (t.contentReplace) {
						content = fs.readFileSync(path, "utf8");
						content = content.replace(/VERSIÖN/g, pjson.versionStr);
						// why
						var apiPath, platform;
						if (req.headers.host != "localhost" && req.headers.host != `localhost:${process.env.SERVER_PORT}`) {
							apiPath = `https://${req.headers.host}`;
							platform = "online";
							content = content.replace(/NEWS/g, "LinuxAnimate now has it's own online lvm clone! if this is your first time using linuxanimate and you are not in the goanimate community, please click");
						} else {
							apiPath = `http://${req.headers.host}`;
							platform = "offline";
							content = content.replace(/NEWS/g, "The First Half Of LinuxAnimate Development Is Complete. Pretty soon, updating asset names, tags, and theme searching are to await. if this is your first time using linuxanimate and you are not in the goanimate community, please click");
						}
						content = content.replace(/LINK/g, `<a href="https://josephanimate2021.github.io/lvm-static/2014?api=${apiPath}&action=create&tutorial=0&tray=retro&return=${apiPath}&platform=${platform}">here</a>`);
						content = content.replace(/BUTTON/g, `<a class="button_big" href="https://josephanimate2021.github.io/lvm-static/2014?api=${apiPath}&action=create&tray=retro&return=${apiPath}&platform=${platform}">MAKE A VIDEO</a>`);
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
