const folder = process.env.WATERMARKS_FOLDER;
const savedFolder = process.env.SAVED_FOLDER;
const fs = require("fs");

module.exports = {
	save(mId, wId) {
		var path = `${folder}/${mId}.xml`;
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
	assign(mId, wId) {
		var path = `${savedFolder}/${mId}.xml`;
		var wXml;
		switch (wId) {
			case "0dhteqDBt5nY": {
				wXml = 'No Logo';
				break;
			}
			case "0vTLbQy9hG7k": {
				wXml = 'GoAnimate Logo';
				break;
			}
			case "174tbqdo0cs6": {
				wXml = 'GoAnimate For Schools Logo';
				break;
			}
			case "52ht3dd60csd": {
				wXml = 'GoAnimate - Go Make Your Own Logo';
				break;
			}
			case "82tkgqdefbw6": {
				wXml = 'GoAnimate Free Trial Logo';
				break;
			}
		}
		fs.writeFileSync(path, wXml);
	},
};
