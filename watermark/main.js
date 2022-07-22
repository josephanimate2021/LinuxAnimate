const folder = process.env.WATERMARKS_FOLDER;
const savedFolder = process.env.SAVED_FOLDER;
const path = require("path");
const customWatermarks = path.join("../", folder);
const fs = require("fs");

module.exports = {
	save(mId, wId, wTitle) {
		// vars
		var path = `${folder}/${mId}.xml`;
		var wXml, id; 
		var jpg = `${wId}-wtr.jpg`;
		var png = `${wId}-wtr.png`;
		var swf = `${wId}-wtr.swf`;
		// initization (custom watermarks)
		if (!fs.existsSync(jpg)) {
		    id = swf;
		}
		if (!fs.existsSync(png)) {
		    id = jpg;
		}
		if (!fs.existsSync(swf)) {
		    id = png;
		}
		// save watermarks
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
			default: {
				wXml = `<watermarks><watermark>${customWatermarks}/${id}</watermark></watermarks>`;
				break;
			}
		}
		fs.writeFileSync(path, wXml);
		this.assign(mId, wId);
	},
	assign(mId, wId) {
		var path = `${savedFolder}/${mId}.xml`;
		var wXml;
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
			default: {
				wXml = '<watermark>Custom Logo<watermark>';
				break;
			}
		}
		fs.writeFileSync(path, wXml);
	},
};
