const watermark = require("../watermark/main");
module.exports = function (req, res, url) {
  if (req.method != "POST") return;
  const match = req.url.match(/\/goapi\/assignwatermark\/movie\/([^/]+)\/([^.]+)$/);
  if (!match) return;

  const mId = match[1];
  var wId;
  var id, wImg;
  switch (wId) {
    case "0vTLbQy9hG7k":
    case "174tbqdo0cs6":
    case "52ht3dd60csd":
    case "82tkgqdefbw6":
    case "0dhteqDBt5nY": {
      wId = match[2];
      id = watermark.save(mId, wId);
      res.end(id);
      break;
    }
    default: {
      wImg = match[2];
      wId = wImg.slice(0, -8);
      id = watermark.save(mId, wId, wImg);
      res.end(id);
    }
  }
}
