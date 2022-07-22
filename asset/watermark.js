const loadPost = require("../misc/post_body");
const asset = require("./main");
const base = Buffer.alloc(1, 0);

async function listAssets(data) {
	var files = asset.list(data.movieId, "wtr");
	// premade watermarks
	var xmlString = `
	<?xml encoding="UTF-8"?><watermarks><watermark id="174tbqdo0cs6" thumbnail="${
	process.env.WATERMARKS_FOLDER}/Go4Schools.png"/><preview>174tbqdo0cs6</preview><watermark id="82tkgqdefbw6" thumbnail="${
	process.env.WATERMARKS_FOLDER}/freeTrial.png"/><preview>82tkgqdefbw6</preview><watermark id="52ht3dd60csd" thumbnail="${
	process.env.WATERMARKS_FOLDER}/GoMakeYourOwn.png"/><preview>52ht3dd60csd</preview>${
	// custom watermarks
	files.map(v => `<watermark id="${v.name.slice(0, -5)}" thumbnail="${
		  process.env.WATERMARKS_FOLDER}/${v.id}"/><preview>${v.id}</preview>`).join("")}</watermarks>`;
	return xmlString;
}

module.exports = function (req, res, url) {
	if (req.method != 'POST') return;

	var makeZip = false; switch (url.path) {
		case '/goapi/getUserWatermarks/': break;
		default: return;
	}
	loadPost(req, res).then(([data]) => listAssets(data)).then((buff) => {
		res.setHeader("Content-Type", "text/xml");
		res.end(buff);
	});
	return true;
}
