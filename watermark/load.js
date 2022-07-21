const fUtil = require("../misc/file");
const base = Buffer.alloc(1, 0);
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var path = url.pathname;
  switch (req.method) {
    case "GET": {
    case "POST": {
      switch (url.pathname) {
        case "/goapi/getMovieInfo/": {
          fs.readFileSync();
          break;
        }
      }
      return true;
    }
  }
};
