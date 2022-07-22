const folder = process.env.WAVEFORMS_FOLDER;
const fs = require("fs");

module.exports = {
	save(wId) {
		var path = `${folder}/${wId}.wf`;
		fs.writeFileSync(path);
	}
};
