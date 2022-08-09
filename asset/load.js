const loadPost = require("../misc/post_body");
const asset = require("./main");
const character = require("../character/main");
const movie = require("../movie/main");
const starter = require("../starter/main");
const http = require("http");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	switch (req.method) {
		case "GET": {
			const match = req.url.match(/\/(assets|goapi\/getAsset)\/([^/]+)\/([^.]+)(?:\.xml)?$/);
			if (!match) return;

			const ut = match[1];
			const aId = match[2];
			const b = asset.load(ut, aId);
			if (b) {
				res.statusCode = 200;
				res.end(b);
			} else {
				res.statusCode = 404;
				res.end(e);
			}
			const charMatch = req.url.match(/\/characters\/([^.]+)(?:\.xml)?$/);
			if (!charMatch) return;

			var id = charMatch[1];
			res.setHeader("Content-Type", "text/xml");
			character
				.load(id)
				.then((v) => {
					(res.statusCode = 200), res.end(v);
				})
				.catch((e) => {
					(res.statusCode = 404), res.end(e);
				});
			return true;
		}

		case "POST": {
			switch (url.pathname) {
				case "/goapi/getAsset/":
				case "/goapi/getAssetEx/": {
					loadPost(req, res).then(([data]) => {
						const aId = data.assetId || data.enc_asset_id;
						console.log(data.ut);
						const b = asset.load(data.ut, aId);
						if (b) {
							res.setHeader("Content-Length", b.length);
							res.setHeader("Content-Type", "audio/mp3");
							res.end(b);
						} else {
							res.statusCode = 404;
							res.end();
						}
					});
					return true;
				}
				case "/goapi/deleteAsset/": {
					// only accept the request on localhost
					switch (req.headers.host) {
						case "localhost": 
						case `localhost:${process.env.SERVER_PORT}`: {
							loadPost(req, res).then(async ([data]) => {
								const ut = data.ut;
								const aId = data.assetId || data.enc_asset_id;
								asset.delete(ut, aId);
							});
							return true;
						}
					}
				}
				case "/goapi/DeleteUserTemplate/": {
					const port = process.env.SERVER_PORT;
					// only accept the request on localhost
					switch (req.headers.host) {
						case "localhost": loadPost(req, res).then(async ([data]) => starter.delete(data.templateId));
						case `localhost:${port}`: loadPost(req, res).then(async ([data]) => starter.delete(data.templateId));
					}
					return true;
				}
				default:
					return;
			}
		}
		default:
			return;
	}
};
