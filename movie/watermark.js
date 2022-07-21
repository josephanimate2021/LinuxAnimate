const watermark = require("../watermark/main");
module.exports = function (req, res, url) {
  if (req.method != "POST") return;
  const match = req.url.match(/\/goapi\/assignwatermark\/movie\/([^/]+)\/([^.]+)$/);
  if (!match) return;

  const mId = match[1];
  const wId = match[2];
  const id = watermark.save(mId, wId);
  res.end(id);
}
