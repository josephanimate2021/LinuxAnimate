const folder = process.env.WATERMARKS_FOLDER;
const fs = require("fs");

module.exports = {
	save(wId) {
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
			case "174tbqdo0cs6": {
				wXml = '<watermarks><watermark style="g4s"/></watermarks>';
				break;
			}
			case "52ht3dd60csd": {
				wXml = '<watermarks><watermark style="twoLines"/></watermarks>';
				break;
			}
			case "82tkgqdefbw6": {
				wXml = '<watermarks><watermark style="freeTrial"/></watermarks>';
				break;
			}
		}
		fs.writeFileSync(path, wXml);
	},
};
