const folder = process.env.WATERMARKS_FOLDER;
const fs = require("fs");

module.exports = {
	save(mId, wId) {
		var path = `${folder}/watermarks.txt`;
		var wXml;
		switch (wId) {
			case "0dhteqDBt5nY": {
				wXml = '<watermarks><watermark style="visualplugin"/></watermarks>';
				break;
			}
			case "0vTLbQy9hG7k": {
				wXml = '<watermarks></watermarks>';
				break;
			}
			default: {
				wXml = '<watermarks><watermark style="freeTrial"/></watermarks>';
				break;
			}
		}
		fs.writeFileSync(path, wXml);
	},
};
