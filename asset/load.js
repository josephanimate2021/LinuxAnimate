const loadPost = require("../misc/post_body");
const asset = require("./main");
const character = require("../character/main");
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

			const mId = match[1];
			const aId = match[2];
			const b = asset.load(mId, aId);
			if (b) {
				res.statusCode = 200;
				res.end(b);
			} else {
				res.statusCode = 404;
				res.end(e);
			}
			return true;
		}

		case "POST": {
			switch (url.pathname) {
				case "/goapi/getAsset/":
				case "/goapi/getAssetEx/": {
					loadPost(req, res).then(([data, mId]) => {
						const aId = data.assetId || data.enc_asset_id;

						const b = asset.load(mId, aId);
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
					loadPost(req, res).then(([data, mId]) => {
						const aId = data.assetId || data.enc_asset_id;
						/* 
						honestly, char deleting is for the dev channel anyway and it may break on you anyway as well. 
						So lets just delete regular assets instead.
						*/
						const b = asset.delete(mId, aId);
						if (b) {
							res.end(b);
						} else {
							res.statusCode = 404;
							res.end();
						}
					});
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
