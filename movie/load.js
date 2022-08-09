const movie = require("./main");
const watermark = require("../watermark/main");
const starter = require("../starter/main");
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
					}).catch(e => { // try starter
						starter.loadZip(id).then((v) => {
							if (v) {
								res.statusCode = 200;
								res.end(v);
							} else {
								res.statusCode = 404;
								res.end();
							}
						}).catch(e => { // after two tries, just throw the error.
							console.log("Error:", e);
						});
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
					}).catch(e => { // try starter
						starter.loadXml(id).then((v) => {
							if (v) {
								res.statusCode = 200;
								res.end(v);
							} else {
								res.statusCode = 404;
								res.end();
							}
						}).catch(e => { // after two tries, just throw the error.
							console.log("Error:", e);
						});
					});
					break;
			}
			return true;
		}

		case "POST": {
			switch (url.pathname) {
				case "/goapi/getMovie/": {
					res.setHeader("Content-Type", "application/zip");

					movie.loadZip(url.query.movieId).then(b => {
						res.end(Buffer.concat([base, b]))
					}).catch(e => { // try starter
						starter.loadZip(url.query.movieId).then(b => {
							res.end(Buffer.concat([base, b]))
						}).catch(e => { // after two tries, just throw the error.
							console.log("Error:", e);
							// display an error for retro videomakers
							res.end(1 + e);
						});
					});
					return true;
				}
				case "/ajax/deleteStarter/":
				case "/ajax/deleteChar/":
				case "/ajax/deleteMovie/": {
					// reject a movie delete request that someone made.
					if (req.headers.host != "localhost:4343") console.log("A Delete Request someone has made has been rejected.");
					// accept a delete request on localhost.
					else {
						console.log("Warning! Deleting Movie!");
						movie.delete(url.query.movieId).catch(e => { // try starter
							console.log("Warning! Deleting Starter");
							starter.delete(url.query.movieId).catch(e => console.log("Error:", e));
						});
					}
					return true;
				}
			}
		}
		default:
			return;
	}
};
