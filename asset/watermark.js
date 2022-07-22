const loadPost = require("../misc/post_body");
const asset = require("./main");

module.exports = function (req, res, url) {
	if (req.method != 'POST' || url.path != '/goapi/getUserWatermarks/') return;
	loadPost(req, res).then(async ([data]) => {
		var mId = data.movieId;
		var xmlString, files;
		files = asset.list(mId, "watermark");
		xmlString = `<?xml encoding="UTF-8"?><watermarks><watermark id="174tbqdo0cs6" thumbnail="${process.env.WATERMARKS_FOLDER}/Go4Schools.png" name="GoAnimate For Schools Logo"/><preview>174tbqdo0cs6</preview><watermark id="82tkgqdefbw6" thumbnail="${process.env.WATERMARKS_FOLDER}/freeTrial.png" name="GoAnimate Free Trial Logo"/><preview>82tkgqdefbw6</preview><watermark id="52ht3dd60csd" thumbnail="${process.env.WATERMARKS_FOLDER}/GoMakeYourOwn.png" name="GoAnimate - Go Make Your Own Logo"/><preview>52ht3dd60csd</preview>${files.map(v => `<watermark id="${v.id}" thumbnail="${process.env.WATERMARKS_FOLDER}/${v.id}" name="Custom Logo"/><preview>${v.id}</preview>`).join("")}</watermarks>`;
	});
	res.setHeader("Content-Type", "text/xml");
	res.end(xmlString);
}
