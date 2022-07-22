const watermark = require("../watermark/main");
module.exports = function (req, res, url) {
  if (req.method != "POST") return;
  const match = req.url.match(/\/goapi\/assignwatermark\/movie\/([^/]+)\/([^.]+)$/);
  if (!match) return;

  const mId = match[1];
  const wId = match[2];
  if (`${wId}-wtr.swf`|| `${wId}-wtr.jpg` || `${wId}-wtr.png`) {
    var idSliced = wId.slice(0, -8);
    const id = watermark.save(mId, wId, idSliced);
    res.end(id);
  } else {
    const id = watermark.save(mId, wId);
    res.end(id);
  }
}
