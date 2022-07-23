const fUtil = require("../misc/file");
const stuff = require("./info");
const http = require("http");

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;

	var attrs, params, title, ut, trayQuery, api;
	switch (process.env.PROJECT_RELEASE) {
		case "stable": {
			ut = "10";
			break;
		}
		case "goproduction": {
			ut = "30";
			break;
		}
		case "dev": {
			ut = "60";
			break;
		}
	}
	var trayQuery = query.tray;
	switch (url.pathname) {
		case "/cc": {
			title = "Character Creator";
			attrs = {
				data: process.env.SWF_URL + "/cc.swf", // data: 'cc.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "business",
					ut: ut,
					bs: "default",
					appCode: "go",
					page: "",
					siteId: "go",
					m_mode: "school",
					isLogin: "Y",
					isEmbed: 1,
					ctc: "go",
					tlang: "en_US",
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc.swf", // 'http://localhost/cc.swf'
			};
			break;
		}

		case "/cc_browser": {
			title = "CC Browser";
			attrs = {
				data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "family",
					ut: ut,
					appCode: "go",
					page: "",
					siteId: "go",
					m_mode: "school",
					isLogin: "Y",
					isEmbed: 1,
					ctc: "go",
					tlang: "en_US",
					lid: 13,
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc_browser.swf", // 'http://localhost/cc_browser.swf'
			};
			break;
		}

		case "/go_full": {
			let presave =
				query.movieId && query.movieId.startsWith("m")
					? query.movieId
					: `m-${fUtil[query.noAutosave ? "getNextFileId" : "fillNextFileId"]("movie-", ".xml")}`;
			title = "Video Editor";
			attrs = {
				data: process.env.SWF_URL + "/go_full.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					movieId: "",
					loadas: 0,
					asId: "",
					originalId: "",
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					animationPath: process.env.SWF_URL + "/",
					userId: "0DyHqK6Yj9dM",
					username: "good bois",
					uemail: "crazy suitcase",
					numContact: "0",
					ut: 23,
					ve: false,
					isEmbed: 0,
					nextUrl: "\/movie\/<movieId>\/0\/1",
					bgload: process.env.SWF_URL + "/go_full.swf",
					lid: "11",
					ctc: "go",
					themeColor: "silver",
					tlang: "en_US",
					siteId: "11",
					templateshow: "false",
					forceshow: "false",
					appCode: "go",
					lang: "en",
					tmcc: "192",
					fb_app_url: "/",
					is_published: "1",
					is_private_shared: "0",
					upl: 1,
					role: "student",
					hb: "1",
					pts: "0",
					msg_index: "",
					ad: 0,
					has_asset_bg: 0,
					has_asset_char: 0,
					initcb: "studioLoaded",
					retut: 0,
					s3base: "/movie_thumbs/",
					st: "",
					uisa: 0,
					u_info_school: "OjI6a2JxQzN0MFNSKzFTYW4wTENRc01PZ2N6TURkZ0J3OWFmTzRjeW9aS3l1ak04MCtnUE5CUFo3Y0hmT0JDZndlMDlCM1V0VVVfc05pTU41cGVHYXpKOXV4YVpPZG9icHNoMHNHZmtiWjMxRnpTYlFXNDdPNHk0PQ==",
					tm: "FIN",
					tray: "custom",
					uplp: 0,
					isWide: 1
				},
				allowScriptAccess: "always",
			};
			break;
		}

		case "/player": {
			title = "Player";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					ut: ut,
					autostart: 1,
					isWide: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(`<script>document.title='${title}',flashvars=${
		// json flashvars
		JSON.stringify(params.flashvars)}</script><body style="margin:0px">${
		// object flashvars
		toObjectString(attrs, params)}</body>${stuff.pages[url.pathname] || ""}`);
	return true;
};
