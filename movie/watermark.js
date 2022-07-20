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
				case "0dhteqDBt5nY": {
					wStyle = '<watermark style="twoLines"/>';
					break;
				}
				default: {
					wStyle = '<watermark style="visualplugin"/>';
					break;
				}
			}
			const mId = movie.save('watermark', id);
			const xml = `${header}<watermarks><watermark id="${wId}" thumbnail="${process.env.WATERMARKS_FOLDER}/${wId}.png"/><preview>${wId}</preview></watermarks>`;
			switch (url.pathname) {
				case "/goapi/getUserWatermarks/": {
					res.end(xml);
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
