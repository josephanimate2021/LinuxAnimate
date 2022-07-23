const loadPost = require("../misc/post_body");
const formidable = require("formidable");
const asset = require("./main");
const http = require("http");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(require("@ffmpeg-installer/ffmpeg").path);
ffmpeg.setFfprobePath(require("@ffprobe-installer/ffprobe").path);
const { Readable } = require("stream");
const fs = require("fs");
const mp3Duration = require("mp3-duration");
const sharp = require("sharp");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	var isRecord;
	switch (url.pathname) {
		case "/upload_asset": {
			formidable().parse(req, (_, fields, files) => {
				var [mId, mode, ext] = fields.params.split(".");
				switch (mode) {
					case "vo": {
						mode = "voiceover";
						break;
					}
					case "se": {
						mode = "soundeffect";
						break;
					}
					case "mu": {
						mode = "music";
						break;
					}
				}

				var path = files.import.path;
				var buffer = fs.readFileSync(path);
				asset.save(buffer, mId, mode, ext);
				fs.unlinkSync(path);
				delete buffer;
				res.end();
			});
			return true;
		}
		case "/goapi/saveSound/": // sound recording/uploading through the lvm
			loadPost(req, res).then(([data, mId]) => {
				isRecord = data.bytes ? true : false;

				let oldStream, stream, ext;
				if (isRecord) {
					const buffer = Buffer.from(data.bytes, "base64");
					oldStream = Readable.from(buffer);
					ext = "ogg";
				} else {
					// read the file
					const path = data.Filedata.filepath
					oldStream = fs.createReadStream(path);
					// get the extension
					const origName = data.Filename;
					const dotIn = origName.lastIndexOf(".");
					ext = origName.substring(dotIn + 1);
				}
			
				let meta = {
					type: "sound",
					subtype: data.subtype,
					title: data.title,
					ext: "mp3",
					themeId: "ugc"
				};
			
				if (ext !== "mp3") {
					await new Promise((resolve, rej) => {
						// convert the sound to an mp3
						const command = ffmpeg(oldStream)
						.inputFormat(ext).toFormat("mp3").on("error", (e) => rej("Error converting audio:", e));
						stream = command.pipe();
						resolve();
					});
				} else stream = oldStream;

				let buffers = [];
				stream.resume();
				stream.on("data", b => buffers.push(b));
				stream.on("end", () => {
					const buf = Buffer.concat(buffers);
					mp3Duration(buf, (e, duration) => {
						if (e || !duration) return;
						meta.duration = 1e3 * duration;
						const aId = asset.save(buf, mId, meta.subtype, "mp3");
					res.end(
						`0<response><asset><id>${aId}</id><enc_asset_id>${aId}</enc_asset_id><type>sound</type><subtype>${meta.subtype}</subtype><title>${meta.title}</title><published>0</published><tags></tags><duration>${meta.duration}</duration><downloadtype>progressive</downloadtype><file>${aId}</file></asset></response>`
					);
				});
				return true;
				});
			}
	}
};
