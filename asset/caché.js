const cachéFolder = process.env.CACHÉ_FOLDER;
const propsFolder = process.env.PROPS_FOLDER;
const fs = require("fs");

/**
 * @summary Dictionary of hashmaps of saved assets, respective to each movie ID loaded.
 * @typedef {string[]} cTableType
 * @typedef {{[mId:string]:cTableType}} lcType
 * @type lcType
 */
const localCaché = {};
var size = 0;

// IMPORTANT: serialises the cachéd files into the dictionaries.
fs.readdirSync(cachéFolder).forEach((v) => {
	const index = v.indexOf(".");
	const prefix = v.substr(0, index);
	const suffix = v.substr(index + 1);

	if (!localCaché[prefix]) localCaché[prefix] = [];
	localCaché[prefix].push(suffix);
});

module.exports = {
	/**
	 * @summary Generates a random ID with a given prefix and suffix that is unique to the given table.
	 * @param {string} pre
	 * @param {string} suf
	 * @param {cTableType} table
	 */
	generateId(pre = "", suf = "", table = []) {
		var id;
		do id = `${pre}${("" + Math.random()).replace(".", "")}${suf}`;
		while (table.includes(id));
		return id;
	},
	validAssetId(aId) {
		switch (aId) {
			case "id":
			case "time":
				return false;
			default:
				return true;
		}
	},
	/**
	 *
	 * @summary Saves a buffer in ut caché with a given ID.
	 * @param {string} ut
	 * @param {string} aId
	 * @param {Buffer} buffer
	 */
	save(ut, aId, buffer) {
		if (!this.validAssetId(aId)) return;
		localCaché[ut] = localCaché[ut] || [];
		var stored = localCaché[ut];
		const path = `${cachéFolder}/${ut}.${aId}`;

		if (!stored.includes(aId)) stored.push(aId);
		if (fs.existsSync(path)) size -= fs.statSync(path).size;
		fs.writeFileSync(path, buffer);
		size += buffer.size;
		return buffer;
	},
	/**
	 *
	 * @summary Saves a buffer in the props folder with a given ID.
	 * @param {string} ut
	 * @param {string} aId
	 * @param {Buffer} buffer
	 */
	saveProp(ut, aId, buffer) {
		if (!this.validAssetId(aId)) return;
		localCaché[ut] = localCaché[ut] || [];
		var stored = localCaché[ut];
		const path = `${propsFolder}/${aId}`;

		if (!stored.includes(aId)) stored.push(aId);
		if (fs.existsSync(path)) size -= fs.statSync(path).size;
		fs.writeFileSync(path, buffer);
		size += buffer.size;
		return buffer;
	},
	/**
	 *
	 * @summary Saves a buffer in the props folder with a given ID.
	 * @param {string} mId
	 * @param {string} aId
	 * @param {Buffer} buffer
	 */
	saveWatermark(ut, aId, buffer, ext) {
		if (!this.validAssetId(aId)) return;
		localCaché[ut] = localCaché[ut] || [];
		var stored = localCaché[ut];
		const path = process.env.WATERMARKS_FOLDER + `/${aId}`;
		const newPath = process.env.WATERMARKS_FOLDER + `/${aId.slice(0, -13)}-wtr.${ext}`;

		if (!stored.includes(aId)) stored.push(aId);
		if (fs.existsSync(path)) size -= fs.statSync(path).size;
		fs.writeFileSync(path, buffer);
		fs.renameSync(path, newPath);
		size += buffer.size;
		return buffer;
	},
	/**
	 *
	 * @summary Saves a given dictionary of buffers to caché.
	 * @param {string} ut
	 * @param {{[aId:string]:Buffer}} buffers
	 * @returns {{[aId:string]:Buffer}}
	 */
	saveTable(ut, buffers = {}) {
		for (const aId in buffers) {
			this.save(ut, aId, buffers[aId]);
		}
		return buffers;
	},
	/**
	 *
	 * @summary Retrieves an array of buffers from a given video's caché.
	 * @param {string} ut
	 * @returns {{[aId:string]:Buffer}}
	 */
	loadTable(ut) {
		const buffers = {};
		this.list(ut).forEach((aId) => {
			buffers[aId] = fs.readFileSync(`${cachéFolder}/${ut}.${aId}`);
		});
		return buffers;
	},
	/**
	 *
	 * @summary Retrieves the array of asset IDs for the given video.
	 * @param {string} mId
	 * @returns {cTableType}
	 */
	list(ut) {
		return localCaché[ut] || [];
	},
	/**
	 *
	 * @summary Allocates a new video-wide ID for a given buffer in the caché.
	 * @param {Buffer} buffer
	 * @param {string} ut
	 * @param {string} prefix
	 * @param {string} suffix
	 */
	newItem(buffer, ut, prefix = "", suffix = "") {
		localCaché[ut] = localCaché[ut] || [];
		var stored = localCaché[ut];
		var aId = this.generateId(prefix, suffix, stored);
		this.save(ut, aId, buffer);
		return aId;
	},
	/**
	 *
	 * @summary Generates a new id for the props so that the fs module can read it later.
	 * @param {Buffer} buffer
	 * @param {string} ut
	 * @param {string} prefix
	 * @param {string} suffix
	 */
	newProp(buffer, ut, prefix = "", suffix = "") {
		localCaché[ut] = localCaché[ut] || [];
		var stored = localCaché[ut];
		var aId = this.generateId(prefix, suffix, stored);
		this.saveProp(ut, aId, buffer);
		this.save(ut, aId, buffer);
		return aId;
	},
	/**
	 *
	 * @summary Generates a new id for the props so that the fs module can read it later.
	 * @param {Buffer} buffer
	 * @param {string} mId
	 * @param {string} prefix
	 * @param {string} suffix
	 */
	newWatermark(buffer, ut, prefix = "", suffix = "", ext) {
		localCaché[ut] = localCaché[ut] || [];
		var stored = localCaché[ut];
		var aId = this.generateId(prefix, suffix, stored);
		this.saveWatermark(ut, aId, buffer, ext);
		this.save(ut, aId, buffer);
		return aId;
	},
	/**
	 *
	 * @param {string} mId
	 * @param {string} aId
	 * @returns {Buffer}
	 */
	load(ut, aId) {
		if (!this.validAssetId(aId)) return;
		const stored = localCaché[ut];
		if (!stored) return null;

		const path = `${cachéFolder}/${ut}.${aId}`;
		stored.time = new Date();
		if (stored.includes(aId)) {
			if (!fs.existsSync(path)) {
				delete localCaché[ut];
			} else {
				return fs.readFileSync(path);
			}
		}
	},
	/**
	 *
	 * @param {string} mId
	 * @param {boolean} setToEmpty
	 * @returns {void}
	 */
	delete(ut, aId) {
		const stored = localCaché[ut];
		if (!stored) return;
		var path = `${cachéFolder}/${ut}.${aId}`;
		size -= fs.statSync(path).size;
		fs.unlinkSync(path);
		delete localCaché[ut];
	},
	/**
	 *
	 * @summary Transfers all caché data as if 'old' had never existed.
	 * @param {string} old
	 * @param {string} nëw
	 * @returns {void}
	 */
	transfer(old, nëw) {
		if (nëw == old || !localCaché[old]) return;
		(localCaché[nëw] = localCaché[old]).forEach((aId) => {
			const oldP = `${cachéFolder}/${old}.${aId}`;
			const nëwP = `${cachéFolder}/${nëw}.${aId}`;
			fs.renameSync(oldP, nëwP);
		});
		delete localCaché[old];
	},
	/**
	 *
	 * @param {string} mId
	 * @param {boolean} setToEmpty
	 * @returns {void}
	 */
	clearTable(ut, setToEmpty = true) {
		const stored = localCaché[ut];
		if (!stored) return;
		stored.forEach((aId) => {
			if (aId != "time") {
				var path = `${cachéFolder}/${ut}.${aId}`;
				size -= fs.statSync(path).size;
				fs.unlinkSync(path);
			}
		});
		if (setToEmpty) localCaché[ut] = [];
		else delete localCaché[ut];
	},
};
