const cheerio = require('cheerio');
const Log = require('./log');
const Map = Array.prototype.map;

module.exports = (html) => {
	const $ = cheerio.load(html);
	return {
		getSupportVersion: () => {
			var versions = [];
			var versionContainer = $('.versions-wrapper .versions .links .li-version-list');
			Map.call(versionContainer, (li, index) => {
				var obj = {
					// 版本
					version : $('span', li).text(),
					// 子版本
					subs : []
				};
				const subContainer = $('.versions-info .text li', li);
				Map.call(subContainer, (item, index) => {
					const link = $('a', item);
					obj.subs.push({
						// 设置版本
						version : $(item).text().replace(/[\t|\n]/g,''),
						// 首页第一个没有a标签，它的url就是当前页面，直接设置为/即可
						url : link.length === 0 ? '/' : link.attr('href')
					});
				});
				versions.push(obj);
			});
			return versions;
		},

		getForgeVersion: () => {
			const table = $('#downloadsTable');
			var versions = [];
			Map.call($('tr', table), (tr, index) => {
				if(index === 0) return;
				const td = $('td', tr);
				const downloads = $('li', td[2]);
				versions.push({
					version: $('ul > li',td[0])[0].children[0].data.replace(/[\t|\n]/g,''),
					date: $(td[1]).text(),
					changelog: $('i.classifier-changelog', downloads).parent().attr('href'),
					installer: $('i.classifier-installer', downloads).parent().next().attr('href'),
					installer_win: $('i.classifier-installer-win', downloads).parent().next().attr('href'),
					mdk: $('i.classifier-mdk', downloads).parent().next().attr('href'),
					universal: $('i.classifier-universal', downloads).parent().next().attr('href'),
					client: $('i.classifier-client', downloads).parent().next().attr('href'),
					server: $('i.classifier-server', downloads).parent().next().attr('href'),
					src: $('i.classifier-src', downloads).parent().next().attr('href'),
					javadoc: $('i.classifier-javadoc', downloads).parent().next().attr('href')
				});
			});
			return versions;
		}
	}
}
