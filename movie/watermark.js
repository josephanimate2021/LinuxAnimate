const header = process.env.XML_HEADER;
const movie = require("./main");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	switch (req.method) {
		case "POST": {
			const match = req.url.match(/\/goapi\/assignwatermark\/movie\/([^.]+)\/([^.]+)$/);
			if (!match) return;
			var id = match[1];
			var wId = match[2];
			var wStyle;
			switch (wId) {
				case "0vTLbQy9hG7k": {
					wStyle = '<watermark style="visualplugin"/>';
					break;
				}
				case "0dhteqDBt5nY": {
					wStyle = '<watermark style="twoLines"/>';
					break;
				}
			}
			const mId = movie.save('watermark', id);
			const xml = `${header}<watermarks><watermark id="${wId}" thumbnail="${process.env.WATERMARKS_FOLDER}/${wId}.png"/><preview>${wId}</preview></watermarks>`;
			const wXml = `<watermakrs>${wStyle}</watermarks>`;
			switch (url.pathname) {
				case "/goapi/getUserWatermarks/": {
					res.end(xml);
					break;
				}
				case "/goapi/getMovieInfo/": {
					res.end(wXml);
					break;
				}
			}
			if (url.pathname == `/goapi/assignwatermark/movie/${id}/${wId}`} {
				res.end(mId);
			}
			break;
		}
	}
}
