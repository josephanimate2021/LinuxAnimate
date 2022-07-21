const movie = require("./main");
const watermark = require("../watermark/main");
var path = require('path');
const base = Buffer.alloc(1, 0);
const fs = require("fs");
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
			const match = req.url.match(/\/movies\/([^.]+)(?:\.(zip|xml))?$/);
			if (!match) return;

			var id = match[1];
			var ext = match[2];
			switch (ext) {
				case "zip":
					res.setHeader("Content-Type", "application/zip");
					movie.loadZip(id).then((v) => {
						if (v) {
							res.statusCode = 200;
							res.end(v);
						} else {
							res.statusCode = 404;
							res.end();
						}
					}).catch(e => {
						console.log(e);
					});
					break;
				default:
					res.setHeader("Content-Type", "text/xml");
					movie.loadXml(id).then((v) => {
						if (v) {
							res.statusCode = 200;
							res.end(v);
						} else {
							res.statusCode = 404;
							res.end();
						}
					}).catch(e => {
						console.log(e);
					});
					break;
			}
			return true;
		}

		case "POST": {
			switch (url.pathname) {
				case "/goapi/getMovie/": {
					res.setHeader("Content-Type", "application/zip");

					movie.loadZip(url.query.movieId).then((b) => res.end(Buffer.concat([base, b]))).catch(() => res.end("1"));
					return true;
				}
				case "/goapi/getMovieInfo/": {
					// by default, this will read the goanimate free trial watermark. if a user chooses a watermark in the lvm, then it will then read the user's watermark.
					var readStream = fs.createReadStream(path.join(__dirname, '../', process.env.WATERMARKS_FOLDER) + '/watermarks.txt', 'utf8');
					let data = ''
					readStream.on('data', function(chunk) {
						data += chunk;
					}).on('error', function(err) {
						console.log('Error:', err);
					}).on('end', function() {
						// read the xml on console log to tell the user what watermark they are using.
						console.log(`<?xml encoding="UTF-8"?>${data}`);
						res.end(`<?xml encoding="UTF-8"?>${data}`);
					});
					return true;
				}
				case "/ajax/deleteStarter/":
				case "/ajax/deleteChar/":
				case "/ajax/deleteMovie/": {
					movie.delete(url.query.movieId);
					movie.deleteThumb(url.query.movieId);
					return true;
				}
			}
		}
		default:
			return;
	}
};
