const pjson = require("../package.json");
const stuff = require("./info");
const http = require("http");
const fs = require("fs");
const { rejects } = require("assert");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var methodLinks = stuff[req.method];
	for (let linkIndex in methodLinks) {
		var regex = new RegExp(linkIndex);
		if (regex.test(url.path)) {
			var t = methodLinks[linkIndex];
			var link = t.regexLink ? url.path.replace(regex, t.regexLink) : t.link || url.path;
			var headers = t.headers;
			var path = `./${link}`;

			try {
				for (var headerName in headers || {}) res.setHeader(headerName, headers[headerName]);
				res.statusCode = t.statusCode || 200;
				if (t.content !== undefined) res.end(t.content);
				else if (fs.existsSync(path)) {
					if (t.contentReplace) {
						content = fs.readFileSync(path, "utf8");
						content = content.replace(/VERSIÖN/g, pjson.versionStr);
						// why
						var apiPath, platform;
						if (req.headers.host != "localhost" && req.headers.host != `localhost:${process.env.SERVER_PORT}`) {
							apiPath = `https://${req.headers.host}`;
							platform = "online";
							content = content.replace(/NEWS/g, "LinuxAnimate now has it's own online lvm clone! if this is your first time using linuxanimate and you are not in the goanimate community, please click");
						} else {
							apiPath = `http://${req.headers.host}`;
							platform = "offline";
							content = content.replace(/NEWS/g, "The First Half Of LinuxAnimate Development Is Complete. Pretty soon, updating asset names, tags, and theme searching are to await. if this is your first time using linuxanimate and you are not in the goanimate community, please click");
						}
						content = content.replace(/LINK/g, `<a href="https://josephanimate2021.github.io/lvm-static/2014?api=${apiPath}&action=create&tutorial=0&tray=retro&return=${apiPath}&platform=${platform}">here</a>`);
						content = content.replace(/BUTTON/g, `<a class="button_big" href="https://josephanimate2021.github.io/lvm-static/2014?api=${apiPath}&action=create&tray=retro&return=${apiPath}&platform=${platform}">MAKE A VIDEO</a>`);
						content = content.replace(/SCRIPT/g, `<script>
		var json;
		var tbody = document.getElementsByTagName('tbody')[0];
		var loadMore = document.getElementById('load_more');
		const listReq = new XMLHttpRequest();
		listReq.open('GET', '/movieList');
		listReq.send();

		var C = 0;
		function loadRows() {
			let c = C; C += 69;
			for (; c < C; c++) {
				if (c > json.length - 1) {
					loadMore.remove();
					break;
				}

				const tbl = json[c];
				const date = tbl.date.substr(0, 10) + ' ' + tbl.date.substr(11);
				tbody.insertAdjacentHTML('beforeend',
					'<tr id="' + tbl.id + '"><td><img src="/movie_thumbs/' + tbl.id + '"></td><td><div>' + tbl.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</div><div>' + tbl.durationString + '</div><div>' + tbl.desc + '</div><div>Video Tags: ' + tbl.tag + '</div><div>Watermark: ' + tbl.watermark + '</div><div>Video Res: ' + tbl.res + '</td><td><span>' + date + '</span></td><td><a href="javascript:;" onclick="popup(\'' + tbl.id + '\', \'' + tbl.wide + '\')"></a><a href="https://josephanimate2021.github.io/lvm-static/2014?api=${apiPath}&action=edit&movieId=' + tbl.id + '&isWide=' + tbl.wide + '"></a><a href="/movies/' + tbl.id + '.xml" download="' + tbl.title + '"></a><a href="javascript:deleteMovie(\'' + tbl.id + '\')"></a></td></tr>');
			}
		}

		loadMore.onclick = loadRows;
		listReq.onreadystatechange = function (e) {
			if (listReq.readyState != 4) return;
			json = JSON.parse(listReq.responseText);
			loadRows();
		}

		function popup(id, wide) {
			window.open('/player?movieId=' + id + '&isWide=' + wide, 'MsgWindow', 'width=1280,height=723,left=' + (screen.width / 2 - 640) + ',top=' + (screen.height / 2 - 360));
		}
		
		function deleteMovie(id) {
			const xhttp = new XMLHttpRequest();
		        xhttp.open('POST', '/ajax/deleteMovie/?movieId=' + id);
		        xhttp.send();
                        document.getElementById(id).style.display = "none";
		}
	</script>`);
						res.end(content);
					} else {
						fs.createReadStream(path).pipe(res);
					}
				} else throw null;
			} catch (e) {
				res.statusCode = t.statusCode || 404;
				console.log("Error:", e);
			}
			return true;
		}
	}
	return false;
};
