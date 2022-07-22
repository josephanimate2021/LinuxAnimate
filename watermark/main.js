const folder = process.env.WATERMARKS_FOLDER;
const savedFolder = process.env.SAVED_FOLDER;
const fs = require("fs");

module.exports = {
	save(mId, wId, wImg) {
		// vars
		var path = `${folder}/${mId}.xml`;
		var wXml; 
		// custom watermarks
		if (wImg) {
			wXml = `<watermarks><watermark>/${folder}/${wId}</watermark></watermarks>`;
		} else {
			// premade watermarks
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
		}
		fs.writeFileSync(path, wXml);
		this.assign(mId, wId, wImg);
	},
	assign(mId, wId, wImg) {
		var path = `${savedFolder}/${mId}.xml`;
		var wXml;
		if (wImg) {
			wXml = '<watermark>Custom Logo<watermark>';
		} else {
			switch (wId) {
				case "0dhteqDBt5nY": {
					wXml = '<watermark>No Logo</watermark>';
					break;
				}
				case "0vTLbQy9hG7k": {
					wXml = '<watermark>GoAnimate Logo<watermark>';
					break;
				}
				case "174tbqdo0cs6": {
					wXml = '<watermark>GoAnimate For Schools Logo<watermark>';
					break;
				}
				case "52ht3dd60csd": {
					wXml = '<watermark>GoAnimate - Go Make Your Own Logo<watermark>';
					break;
				}
				case "82tkgqdefbw6": {
					wXml = '<watermark>GoAnimate Free Trial Logo<watermark>';
					break;
				}
			}
		}
		fs.writeFileSync(path, wXml);
	},
};
